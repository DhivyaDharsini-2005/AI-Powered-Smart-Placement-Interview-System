import React, { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, AlertTriangle, Eye } from "lucide-react";
import * as interviewService from "../services/interviewService";

const MEDIAPIPE_BASE = "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh";
const CAMERA_UTILS_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js";
const FACE_MESH_URL = `${MEDIAPIPE_BASE}/face_mesh.js`;

// MediaPipe Face Mesh landmark indices used for Eye Aspect Ratio (EAR) -
// the same six-point-per-eye scheme used in the drowsiness-detection project.
const LEFT_EYE = [362, 385, 387, 263, 373, 380];
const RIGHT_EYE = [33, 160, 158, 133, 153, 144];
// Iris center landmarks (only present when refineLandmarks: true)
const LEFT_IRIS = 468;
const RIGHT_IRIS = 473;

const EAR_BLINK_THRESHOLD = 0.21; // below this = eyes considered closed
const BLINK_DEBOUNCE_FRAMES = 3; // consecutive closed frames before counting a blink

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const script = document.createElement("script");
    script.src = src;
    script.crossOrigin = "anonymous";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// Eye Aspect Ratio: (vertical1 + vertical2) / (2 * horizontal)
// Lower EAR = eye more closed. This is the standard Soukupova & Cech formula.
function calcEAR(landmarks, eyeIndices) {
  const [p1, p2, p3, p4, p5, p6] = eyeIndices.map((i) => landmarks[i]);
  const vertical1 = dist(p2, p6);
  const vertical2 = dist(p3, p5);
  const horizontal = dist(p1, p4);
  if (horizontal === 0) return 0.3;
  return (vertical1 + vertical2) / (2 * horizontal);
}

// Rough horizontal gaze estimate: where the iris center sits relative to the
// eye's horizontal span (0 = looking at left corner, 1 = looking at right corner).
function estimateGazeRatio(landmarks, eyeIndices, irisIndex) {
  const leftCorner = landmarks[eyeIndices[0]];
  const rightCorner = landmarks[eyeIndices[3]];
  const iris = landmarks[irisIndex];
  const span = rightCorner.x - leftCorner.x;
  if (span === 0) return 0.5;
  return (iris.x - leftCorner.x) / span;
}

/**
 * Webcam proctoring + APPROXIMATE engagement signals.
 * - Blink rate via Eye Aspect Ratio (EAR) - the same heuristic used in the
 *   drowsiness-detection project, repurposed here for a blinks-per-minute signal.
 * - Rough gaze direction (left/center/right) from iris position vs eye corners.
 * - Tab-switch detection via the native Visibility API.
 *
 * These are heuristic, approximate signals - NOT a clinical or validated
 * measure of confidence, emotion, or attentiveness. They're surfaced as raw
 * numbers (blinks/min, % time looking away) rather than a fabricated single
 * "confidence score", so nothing here overclaims what it can actually measure.
 */
export default function ProctoringCam({ interviewId, onEngagementUpdate }) {
  const videoRef = useRef(null);
  const lastFlagState = useRef(null);
  const lastFlagTime = useRef(0);
  const closedFrameCount = useRef(0);
  const blinkTimestamps = useRef([]);
  const gazeAwayFrames = useRef(0);
  const totalFrames = useRef(0);

  const [camStatus, setCamStatus] = useState("starting");
  const [faceStatus, setFaceStatus] = useState("loading");
  const [blinkRate, setBlinkRate] = useState(0);
  const [gazeStatus, setGazeStatus] = useState("center"); // left | center | right | unknown
  const [warnings, setWarnings] = useState([]);

  const pushWarning = (type, message) => {
    const now = Date.now();
    if (lastFlagState.current === type && now - lastFlagTime.current < 8000) return;
    lastFlagState.current = type;
    lastFlagTime.current = now;
    setWarnings((prev) => [...prev.slice(-4), { type, message, at: new Date() }]);
    if (interviewId) interviewService.logProctoringEvent(interviewId, type).catch(() => {});
  };

  // --- Tab switch detection ---
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) pushWarning("tab_switch", "Tab switch detected - please stay on this tab.");
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId]);

  // Recompute blink rate (blinks in the last 60s) once per second
  useEffect(() => {
    const interval = setInterval(() => {
      const cutoff = Date.now() - 60000;
      blinkTimestamps.current = blinkTimestamps.current.filter((t) => t > cutoff);
      setBlinkRate(blinkTimestamps.current.length);

      if (onEngagementUpdate) {
        const gazeAwayPct = totalFrames.current > 0
          ? Math.round((gazeAwayFrames.current / totalFrames.current) * 100)
          : 0;
        onEngagementUpdate({ blinkRate: blinkTimestamps.current.length, gazeAwayPercent: gazeAwayPct });
      }
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Webcam + MediaPipe Face Mesh ---
  useEffect(() => {
    let stream, camera, faceMesh, cancelled = false;

    async function setup() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
        if (cancelled) return;
        videoRef.current.srcObject = stream;
        setCamStatus("active");
      } catch {
        setCamStatus("error");
        pushWarning("webcam_off", "Webcam access denied or unavailable.");
        return;
      }

      try {
        await loadScript(FACE_MESH_URL);
        await loadScript(CAMERA_UTILS_URL);
        if (cancelled || !window.FaceMesh || !window.Camera) {
          setFaceStatus("unavailable");
          return;
        }

        faceMesh = new window.FaceMesh({ locateFile: (file) => `${MEDIAPIPE_BASE}/${file}` });
        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true, // needed for iris landmarks (gaze estimate)
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        faceMesh.onResults((results) => {
          const faces = results.multiFaceLandmarks;
          totalFrames.current += 1;

          if (!faces || faces.length === 0) {
            setFaceStatus("no_face");
            pushWarning("no_face_detected", "No face detected in frame.");
            return;
          }
          if (faces.length > 1) {
            setFaceStatus("multiple_faces");
            pushWarning("multiple_faces", "Multiple faces detected in frame.");
          } else {
            setFaceStatus("ok");
          }

          const landmarks = faces[0];

          // --- Blink detection via EAR ---
          const leftEAR = calcEAR(landmarks, LEFT_EYE);
          const rightEAR = calcEAR(landmarks, RIGHT_EYE);
          const avgEAR = (leftEAR + rightEAR) / 2;

          if (avgEAR < EAR_BLINK_THRESHOLD) {
            closedFrameCount.current += 1;
          } else {
            if (closedFrameCount.current >= BLINK_DEBOUNCE_FRAMES) {
              blinkTimestamps.current.push(Date.now());
            }
            closedFrameCount.current = 0;
          }

          // --- Gaze estimate ---
          try {
            const leftRatio = estimateGazeRatio(landmarks, LEFT_EYE, LEFT_IRIS);
            const rightRatio = estimateGazeRatio(landmarks, RIGHT_EYE, RIGHT_IRIS);
            const avgRatio = (leftRatio + rightRatio) / 2;
            let direction = "center";
            if (avgRatio < 0.35) direction = "right"; // mirrored: iris toward left-corner of mirrored view
            else if (avgRatio > 0.65) direction = "left";
            setGazeStatus(direction);
            if (direction !== "center") gazeAwayFrames.current += 1;
          } catch {
            setGazeStatus("unknown");
          }
        });

        camera = new window.Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current) await faceMesh.send({ image: videoRef.current });
          },
          width: 320,
          height: 240,
        });
        camera.start();
      } catch (err) {
        console.warn("MediaPipe Face Mesh unavailable:", err.message);
        setFaceStatus("unavailable");
      }
    }

    setup();
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((t) => t.stop());
      camera?.stop?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const faceLabel = {
    loading: "Initializing...",
    ok: "Face detected ✓",
    no_face: "⚠ No face detected",
    multiple_faces: "⚠ Multiple faces detected",
    unavailable: "Face tracking unavailable (webcam preview only)",
  };

  return (
    <div className="panel space-y-3 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
        {camStatus === "active" ? <Camera size={16} className="text-success" /> : <CameraOff size={16} className="text-danger" />}
        Proctoring
      </div>

      <div className="overflow-hidden rounded-lg bg-black">
        <video ref={videoRef} autoPlay playsInline muted className="h-40 w-full object-cover" />
      </div>

      <p className={`text-xs ${faceStatus === "ok" ? "text-success" : faceStatus === "loading" ? "text-white/50" : "text-warning"}`}>
        {faceLabel[faceStatus]}
      </p>

      {faceStatus === "ok" && (
        <div className="space-y-1.5 rounded-lg bg-white/5 p-2.5 text-xs text-white/60">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1"><Eye size={12} /> Blink rate</span>
            <span className="font-medium text-white/80">{blinkRate}/min</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Gaze</span>
            <span className="font-medium text-white/80 capitalize">{gazeStatus}</span>
          </div>
          <p className="pt-1 text-[10px] text-white/30">
            Approximate heuristic signals only - not a validated emotion/confidence measure.
          </p>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="space-y-1">
          {warnings.map((w, i) => (
            <div key={i} className="flex items-start gap-1.5 rounded-md bg-warning-soft px-2 py-1 text-xs text-warning">
              <AlertTriangle size={12} className="mt-0.5 shrink-0" />
              <span>{w.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
