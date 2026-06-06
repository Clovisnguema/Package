import { useState, useRef, useEffect, useCallback } from "react";

// ─── Helpers ───────────────────────────────────────────────────────────────

function splitIntoScenes(text, maxWords = 60) {
  const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0);
  const scenes = [];
  let current = "";
  for (const para of paragraphs) {
    const words = (current + " " + para).trim().split(/\s+/);
    if (words.length > maxWords && current.length > 0) {
      scenes.push(current.trim());
      current = para;
    } else {
      current = current ? current + "\n" + para : para;
    }
  }
  if (current.trim()) scenes.push(current.trim());
  return scenes;
}

const DURATIONS = [
  { label: "30s (Instagram Story)", value: 30 },
  { label: "60s (TikTok / Reels)", value: 60 },
  { label: "3 min (YouTube Shorts)", value: 180 },
];

const STYLES = [
  { label: "Dramatique & Cinématique", value: "dramatic" },
  { label: "Doux & Poétique", value: "poetic" },
  { label: "Mystérieux & Suspense", value: "mystery" },
  { label: "Léger & Humoristique", value: "light" },
];

// ─── Claude API ─────────────────────────────────────────────────────────────

async function generateScenePrompt(sceneText, style, bookTitle, index) {
  const styleGuides = {
    dramatic: "cinématique, fort contraste, lumière dramatique, couleurs profondes",
    poetic: "aquarelle douce, lumières dorées, atmosphère onirique, tons pastel",
    mystery: "ombres profondes, brume, clair-obscur, palette sombre et froide",
    light: "couleurs vives, lumière naturelle joyeuse, tons chauds et ensoleillés",
