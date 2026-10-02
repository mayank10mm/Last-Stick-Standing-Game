/**
 * Central light-theme palette.
 *
 * The HTML shell (index.html), the Phaser game config, and every scene read
 * from here so the whole app stays consistent. All colors are chosen so dark
 * text/art (the tinted stickman sprites are mid-tone) reads clearly on a
 * bright background.
 */

/** Font families used for all in-game text (loaded in index.html). */
export const FONTS = {
  /** Comic-style display font for titles/headings. */
  display: "Bangers",
  /** Rounded, friendly body font. */
  body: "Nunito",
} as const;

/** Page + Phaser background, page text (kept in sync with index.html). */
export const SHELL = {
  /** Page background behind the canvas. */
  bg: "#f5f7fa",
  /** Faint border/frame color used by the shell. */
  frame: "#e0e6ec",
} as const;

/** Colors used inside the game scenes. */
export const THEME = {
  /** Default scene background (menu / boot / preload). */
  sceneBg: "#eef2f7",
  /** Default text color (near-black, high contrast). */
  text: "#1e2836",
  /** Muted secondary text. */
  textMuted: "#5b6b7c",
  /** Faint text used for hints. */
  textFaint: "#8a99a9",
  /** Accent used for the title / progress bar fill. */
  accent: "#0288d1",
  /** Ground slab under the fighters. */
  ground: "#dfe6ee",
  /** Ground line color. */
  groundLine: "#b7c3cf",
  /** HUD bar backgrounds. */
  barBg: "#2b3849",
  /** Damage numbers / hit feedback. */
  damage: "#c62828",
  /** Blocked-hit numbers. */
  blocked: "#1565c0",
  /** Stage banner fill (semi-transparent panel behind stage text). n/a */
  banner: "#ffffff",
  /** Victory background tint. */
  win: "#e8f5e9",
  /** Defeat background tint. */
  lose: "#fbe9e7",
} as const;
