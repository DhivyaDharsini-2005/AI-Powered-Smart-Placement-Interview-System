import React, { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) return resolve();
    if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      // already loading - poll briefly
      const check = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(check);
          resolve();
        }
      }, 100);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Sign-In"));
    document.body.appendChild(script);
  });
}

/**
 * Renders Google's official Sign-In button. Needs a free Google OAuth Client
 * ID set as VITE_GOOGLE_CLIENT_ID in client/.env - see README for setup.
 * Gracefully shows nothing (rather than erroring) if not configured.
 */
export default function GoogleLoginButton({ onSuccess }) {
  const { loginWithGoogle } = useAuth();
  const buttonRef = useRef(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || clientId.includes("your_google_client_id")) return;

    let cancelled = false;
    loadGoogleScript()
      .then(() => {
        if (cancelled || !buttonRef.current) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            try {
              const user = await loginWithGoogle(response.credential);
              toast.success(`Welcome, ${user.name.split(" ")[0]}!`);
              onSuccess?.(user);
            } catch (err) {
              toast.error(err.response?.data?.message || "Google sign-in failed");
            }
          },
        });
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "filled_black",
          size: "large",
          width: 320,
          shape: "pill",
        });
      })
      .catch(() => {
        // Silently degrade - the rest of the login form still works
      });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  if (!clientId || clientId.includes("your_google_client_id")) {
    return (
      <p className="rounded-lg border border-dashed border-surface-border px-3 py-2.5 text-center text-xs text-white/30">
        Google Sign-In not configured (set VITE_GOOGLE_CLIENT_ID in client/.env)
      </p>
    );
  }

  return <div ref={buttonRef} className="flex justify-center" />;
}
