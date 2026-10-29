const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const reportsDir = path.join(__dirname, "..", "reports");
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

// --- Layout constants (A4 in points, proper margins for an ATS-friendly look) ---
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 50;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const COLORS = {
  brand: "#6366f1",
  brandDark: "#4338ca",
  text: "#111827",
  textMuted: "#6b7280",
  textFaint: "#9ca3af",
  success: "#16a34a",
  warning: "#d97706",
  danger: "#dc2626",
  border: "#e5e7eb",
  surface: "#f8f9fc",
};

function scoreColor(score) {
  if (score >= 75) return COLORS.success;
  if (score >= 50) return COLORS.warning;
  return COLORS.danger;
}

/**
 * Ensures there's enough vertical room left on the page for the next block;
 * if not, starts a new page. This is what prevents overlapping content -
 * every section checks its own height need before drawing.
 */
function ensureSpace(doc, neededHeight) {
  const bottomLimit = PAGE_HEIGHT - MARGIN;
  if (doc.y + neededHeight > bottomLimit) {
    doc.addPage();
  }
}

function drawSectionHeader(doc, title) {
  ensureSpace(doc, 50);
  doc.x = MARGIN; // always reset cursor - a prior helper may have left doc.x in a narrow column
  doc.moveDown(0.6);
  doc.fontSize(15).fillColor(COLORS.brand).font("Helvetica-Bold").text(title, MARGIN, doc.y, { width: CONTENT_WIDTH });
  const lineY = doc.y + 4;
  doc.moveTo(MARGIN, lineY).lineTo(PAGE_WIDTH - MARGIN, lineY).strokeColor(COLORS.border).lineWidth(1).stroke();
  doc.x = MARGIN;
  doc.y = lineY + 12;
  doc.font("Helvetica").fillColor(COLORS.text);
}

/** A labeled horizontal progress bar - reused for every score in the report. */
function drawProgressBar(doc, x, y, width, value, label) {
  const barHeight = 14;
  const labelWidth = 170;
  const barWidth = width - labelWidth - 45;

  doc.fontSize(10).fillColor(COLORS.text).font("Helvetica").text(label, x, y + 2, { width: labelWidth });

  doc.roundedRect(x + labelWidth, y, barWidth, barHeight, 6).fillColor(COLORS.border).fill();
  const filled = Math.max(2, (Math.min(100, Math.max(0, value)) / 100) * barWidth);
  doc.roundedRect(x + labelWidth, y, filled, barHeight, 6).fillColor(scoreColor(value)).fill();

  doc.fontSize(10).fillColor(COLORS.text).font("Helvetica-Bold").text(`${value}/100`, x + labelWidth + barWidth + 8, y + 2);
  doc.x = MARGIN; // reset cursor - the explicit-x text calls above otherwise leave doc.x in a narrow column
  return y + barHeight + 14;
}

/** Simple 2-column table with a header row - used for coding/interview detail breakdowns. */
function drawTable(doc, x, y, width, headers, rows, colWidths) {
  const rowHeight = 22;
  let curY = y;

  // Header row
  doc.rect(x, curY, width, rowHeight).fillColor(COLORS.brand).fill();
  let curX = x;
  doc.fontSize(9).fillColor("#ffffff").font("Helvetica-Bold");
  headers.forEach((h, i) => {
    doc.text(h, curX + 6, curY + 6, { width: colWidths[i] - 12 });
    curX += colWidths[i];
  });
  curY += rowHeight;

  // Data rows
  doc.font("Helvetica").fontSize(9);
  rows.forEach((row, rowIndex) => {
    ensureSpace(doc, rowHeight + 5);
    if (doc.y !== curY) curY = doc.y; // page may have changed under us

    if (rowIndex % 2 === 0) {
      doc.rect(x, curY, width, rowHeight).fillColor(COLORS.surface).fill();
    }
    curX = x;
    doc.fillColor(COLORS.text);
    row.forEach((cell, i) => {
      doc.text(String(cell), curX + 6, curY + 6, { width: colWidths[i] - 12 });
      curX += colWidths[i];
    });
    curY += rowHeight;
    doc.y = curY;
  });

  doc.rect(x, y, width, curY - y).strokeColor(COLORS.border).lineWidth(0.5).stroke();
  doc.x = MARGIN; // reset cursor - explicit-x cell text above otherwise leaves doc.x in a narrow column
  doc.y = curY + 10;
  return curY;
}

/** Donut-style overall score gauge drawn with pdfkit arcs - the report's hero visual. */
function drawScoreGauge(doc, centerX, centerY, radius, score, label) {
  const startAngle = -90;
  const endAngle = startAngle + (score / 100) * 360;

  doc.save();
  doc.lineWidth(14);
  doc.strokeColor(COLORS.border);
  doc.path(describeArc(centerX, centerY, radius, 0, 360)).stroke();
  doc.strokeColor(scoreColor(score));
  doc.path(describeArc(centerX, centerY, radius, startAngle, endAngle)).stroke();
  doc.restore();

  doc.fontSize(28).font("Helvetica-Bold").fillColor(COLORS.text)
    .text(String(score), centerX - radius, centerY - 16, { width: radius * 2, align: "center" });
  doc.fontSize(10).font("Helvetica").fillColor(COLORS.textMuted)
    .text(label, centerX - radius, centerY + 16, { width: radius * 2, align: "center" });
  doc.x = MARGIN; // reset cursor - explicit-x text above otherwise leaves doc.x in a narrow column
}

// Builds an SVG-style arc path string pdfkit's .path() can render
function describeArc(cx, cy, r, startDeg, endDeg) {
  const start = polarToCartesian(cx, cy, r, endDeg);
  const end = polarToCartesian(cx, cy, r, startDeg);
  const largeArc = endDeg - startDeg <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}
function polarToCartesian(cx, cy, r, angleDeg) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

function footer(doc, pageLabel) {
  // PDFKit auto-inserts a new page if text would be drawn below the page's
  // margin box, even with an explicit y - temporarily zero the bottom
  // margin so the footer can sit in that reserved space on the SAME page.
  const originalBottom = doc.page.margins.bottom;
  doc.page.margins.bottom = 0;
  doc.fontSize(8).fillColor(COLORS.textFaint).font("Helvetica")
    .text(`AI Placement Interview System  ·  ${pageLabel}`, MARGIN, PAGE_HEIGHT - 35, {
      width: CONTENT_WIDTH, align: "center",
    });
  doc.page.margins.bottom = originalBottom;
  doc.x = MARGIN;
}

/**
 * Generates the complete multi-page placement readiness PDF.
 * Sections: Cover/Summary, Score Breakdown (chart), Aptitude detail,
 * Coding detail, Technical Interview, HR Interview, AI Roadmap, Strengths/Weaknesses.
 */
async function generateReportPDF(data) {
  const {
    userName, targetRole,
    resumeScore, aptitudeScore, codingScore, technicalInterviewScore, hrInterviewScore,
    finalScore, jobReadinessLevel, strengths = [], weaknesses = [],
    mlPlacementLevel = null, mlPlacementProbabilities = null,
    roadmap = null,
    resumeDetail = null, aptitudeDetail = null, codingDetail = [],
    technicalInterviewDetail = null, hrInterviewDetail = null,
  } = data;

  const fileName = `report-${Date.now()}.pdf`;
  const filePath = path.join(reportsDir, fileName);
  const doc = new PDFDocument({ size: "A4", margin: MARGIN, bufferPages: true });
  doc.pipe(fs.createWriteStream(filePath));

  // ===================== PAGE 1: COVER + SUMMARY =====================
  doc.fontSize(24).font("Helvetica-Bold").fillColor(COLORS.brand)
    .text("Placement Readiness Report", { align: "center" });
  doc.fontSize(11).font("Helvetica").fillColor(COLORS.textMuted)
    .text("AI-Powered Smart Placement Interview System", { align: "center" });
  doc.moveDown(1.2);

  doc.moveTo(MARGIN, doc.y).lineTo(PAGE_WIDTH - MARGIN, doc.y).strokeColor(COLORS.border).stroke();
  doc.moveDown(1);

  doc.fontSize(11).fillColor(COLORS.text).font("Helvetica");
  doc.text(`Candidate: ${userName}`);
  doc.text(`Target Role: ${targetRole}`);
  doc.text(`Generated: ${new Date().toLocaleString()}`);
  if (mlPlacementLevel) {
    doc.fillColor(scoreColor(mlPlacementLevel === "High" ? 90 : mlPlacementLevel === "Medium" ? 60 : 30))
      .font("Helvetica-Bold").text(`ML Placement Prediction: ${mlPlacementLevel}`);
    doc.font("Helvetica").fillColor(COLORS.text);
  }
  doc.moveDown(1.5);

  // Hero gauge
  drawScoreGauge(doc, PAGE_WIDTH / 2, doc.y + 70, 65, finalScore, jobReadinessLevel);
  doc.y += 160;

  drawSectionHeader(doc, "Score Breakdown");
  let barY = doc.y;
  barY = drawProgressBar(doc, MARGIN, barY, CONTENT_WIDTH, resumeScore, "Resume (ATS Score)");
  barY = drawProgressBar(doc, MARGIN, barY, CONTENT_WIDTH, aptitudeScore, "Aptitude Assessment");
  barY = drawProgressBar(doc, MARGIN, barY, CONTENT_WIDTH, codingScore, "Coding Assessment");
  barY = drawProgressBar(doc, MARGIN, barY, CONTENT_WIDTH, technicalInterviewScore, "Technical Interview");
  barY = drawProgressBar(doc, MARGIN, barY, CONTENT_WIDTH, hrInterviewScore, "HR Interview");
  doc.y = barY;

  if (mlPlacementProbabilities) {
    drawSectionHeader(doc, "ML Placement Probability");
    doc.fontSize(10).fillColor(COLORS.textMuted)
      .text("From your own trained ensemble model (RandomForest + XGBoost + GradientBoosting + ExtraTrees):");
    doc.moveDown(0.3);
    Object.entries(mlPlacementProbabilities).forEach(([label, pct]) => {
      doc.fontSize(10).fillColor(COLORS.text).text(`${label}: ${pct}%`);
    });
  }

  footer(doc, "Page 1 - Summary");

  // ===================== PAGE 2: APTITUDE DETAIL =====================
  doc.addPage();
  drawSectionHeader(doc, "Aptitude Assessment - Detailed Analysis");
  if (aptitudeDetail) {
    doc.fontSize(10).fillColor(COLORS.text);
    doc.text(`Score: ${aptitudeDetail.score}% (${aptitudeDetail.correctCount}/${aptitudeDetail.totalQuestions} correct)`);
    doc.moveDown(0.6);

    if (aptitudeDetail.topicBreakdown?.length) {
      doc.font("Helvetica-Bold").text("Topic-wise Performance");
      doc.font("Helvetica");
      doc.moveDown(0.3);
      const rows = aptitudeDetail.topicBreakdown.map((t) => [t.topic, `${t.correct}/${t.attempted}`, `${Math.round((t.correct / t.attempted) * 100)}%`]);
      drawTable(doc, MARGIN, doc.y, CONTENT_WIDTH, ["Topic", "Correct", "Accuracy"], rows, [CONTENT_WIDTH * 0.55, CONTENT_WIDTH * 0.2, CONTENT_WIDTH * 0.25]);
    }
  } else {
    doc.fontSize(10).fillColor(COLORS.textMuted).text("No completed Full Aptitude Test found yet. Take the assessment to populate this section.");
  }
  footer(doc, "Page 2 - Aptitude");

  // ===================== PAGE 3: CODING DETAIL =====================
  doc.addPage();
  drawSectionHeader(doc, "Coding Assessment - Detailed Analysis");
  if (codingDetail?.length) {
    doc.fontSize(10).fillColor(COLORS.textMuted)
      .text("Based on your 3 mandatory problems (1 Easy + 1 Medium + 1 Hard):");
    doc.moveDown(0.5);
    const rows = codingDetail.map((c) => [c.questionTitle, c.language, `${c.aiEvaluation?.score ?? "-"}/100`]);
    drawTable(doc, MARGIN, doc.y, CONTENT_WIDTH, ["Problem", "Language", "Score"], rows, [CONTENT_WIDTH * 0.5, CONTENT_WIDTH * 0.25, CONTENT_WIDTH * 0.25]);

    doc.moveDown(0.5);
    codingDetail.forEach((c) => {
      ensureSpace(doc, 60);
      doc.fontSize(10).font("Helvetica-Bold").fillColor(COLORS.text).text(c.questionTitle);
      doc.font("Helvetica").fontSize(9).fillColor(COLORS.textMuted)
        .text(c.aiEvaluation?.feedback || "No AI feedback available.", { width: CONTENT_WIDTH });
      doc.moveDown(0.5);
    });
  } else {
    doc.fontSize(10).fillColor(COLORS.textMuted).text("No mandatory coding problems completed yet.");
  }
  footer(doc, "Page 3 - Coding");

  // ===================== PAGE 4: INTERVIEWS =====================
  doc.addPage();
  drawSectionHeader(doc, "Technical Interview - Detailed Analysis");
  if (technicalInterviewDetail?.evaluation) {
    const ev = technicalInterviewDetail.evaluation;
    doc.fontSize(10).fillColor(COLORS.text).text(`Score: ${ev.score}/100`);
    doc.moveDown(0.3);
    doc.fontSize(10).fillColor(COLORS.textMuted).text(ev.feedback || "", { width: CONTENT_WIDTH });
    doc.moveDown(0.5);
    if (ev.strengths?.length) {
      doc.font("Helvetica-Bold").fillColor(COLORS.success).text("Strengths:");
      doc.font("Helvetica").fillColor(COLORS.text);
      ev.strengths.forEach((s) => doc.text(`• ${s}`));
      doc.moveDown(0.3);
    }
    if (ev.weaknesses?.length) {
      doc.font("Helvetica-Bold").fillColor(COLORS.warning).text("Areas to Improve:");
      doc.font("Helvetica").fillColor(COLORS.text);
      ev.weaknesses.forEach((w) => doc.text(`• ${w}`));
    }
  } else {
    doc.fontSize(10).fillColor(COLORS.textMuted).text("No completed Technical Interview found yet.");
  }

  drawSectionHeader(doc, "HR Interview - Detailed Analysis");
  if (hrInterviewDetail?.evaluation) {
    const ev = hrInterviewDetail.evaluation;
    doc.fontSize(10).fillColor(COLORS.text).text(`Score: ${ev.score}/100`);
    doc.moveDown(0.3);
    doc.fontSize(10).fillColor(COLORS.textMuted).text(ev.feedback || "", { width: CONTENT_WIDTH });
    doc.moveDown(0.5);
    if (ev.strengths?.length) {
      doc.font("Helvetica-Bold").fillColor(COLORS.success).text("Strengths:");
      doc.font("Helvetica").fillColor(COLORS.text);
      ev.strengths.forEach((s) => doc.text(`• ${s}`));
      doc.moveDown(0.3);
    }
    if (ev.weaknesses?.length) {
      doc.font("Helvetica-Bold").fillColor(COLORS.warning).text("Areas to Improve:");
      doc.font("Helvetica").fillColor(COLORS.text);
      ev.weaknesses.forEach((w) => doc.text(`• ${w}`));
    }
  } else {
    doc.fontSize(10).fillColor(COLORS.textMuted).text("No completed HR Interview found yet.");
  }
  footer(doc, "Page 4 - Interviews");

  // ===================== PAGE 5: RESUME, ROADMAP, STRENGTHS/WEAKNESSES =====================
  doc.addPage();
  drawSectionHeader(doc, "Resume Analysis Summary");
  if (resumeDetail) {
    doc.fontSize(10).fillColor(COLORS.text).text(`ATS Score: ${resumeDetail.atsScore}/100`);
    if (resumeDetail.missingKeywords?.length) {
      doc.moveDown(0.3).font("Helvetica-Bold").text("Missing Keywords:").font("Helvetica");
      doc.fontSize(9).fillColor(COLORS.textMuted).text(resumeDetail.missingKeywords.join(", "), { width: CONTENT_WIDTH });
    }
  } else {
    doc.fontSize(10).fillColor(COLORS.textMuted).text("No resume analyzed yet.");
  }

  drawSectionHeader(doc, "Overall Strengths");
  doc.fontSize(10).fillColor(COLORS.text);
  if (strengths.length) strengths.forEach((s) => doc.text(`• ${s}`));
  else doc.fillColor(COLORS.textMuted).text("Complete more assessments to identify strengths.");

  drawSectionHeader(doc, "Areas to Improve");
  doc.fontSize(10).fillColor(COLORS.text);
  if (weaknesses.length) weaknesses.forEach((w) => doc.text(`• ${w}`));
  else doc.fillColor(COLORS.textMuted).text("No significant weak areas detected yet.");

  drawSectionHeader(doc, "Personalized AI Roadmap");
  if (roadmap) {
    doc.fontSize(10).fillColor(COLORS.text).text(roadmap.summary, { width: CONTENT_WIDTH });
    doc.moveDown(0.5);
    (roadmap.roadmap || []).forEach((step, i) => {
      ensureSpace(doc, 30);
      doc.x = MARGIN;
      doc.font("Helvetica-Bold").fillColor(COLORS.brand).text(`${i + 1}. `, MARGIN, doc.y, { continued: true });
      doc.font("Helvetica").fillColor(COLORS.text).text(step);
      doc.x = MARGIN;
      doc.moveDown(0.3);
    });
  } else {
    doc.fontSize(10).fillColor(COLORS.textMuted).text("Roadmap generation unavailable for this report.");
  }

  doc.moveDown(1.5);
  doc.fontSize(8).fillColor(COLORS.textFaint).font("Helvetica")
    .text(
      "This report was generated using AI-based evaluation (Groq Llama models) and your own trained ML models. Scores are indicative and meant for self-improvement, not a guarantee of placement outcome.",
      { align: "center", width: CONTENT_WIDTH }
    );

  footer(doc, "Page 5 - Roadmap");

  doc.end();
  return `/reports/${fileName}`;
}

module.exports = { generateReportPDF };
