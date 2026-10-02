import Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "../config";
import { GameContent } from "../ContentLoader";
import { THEME } from "../theme";

/**
 * Phase 1 of startup: fetch all JSON content (no Phaser asset loading here),
 * stash it in the registry, then hand off to PreloadScene which loads sprites.
 *
 * Note we do NOT use Phaser's loader in this scene. Kicking off `this.load`
 * during an async create stalls the scene lifecycle, so JSON is fetched with
 * plain `fetch()` and the transition happens from a resolved promise.
 *
 * Web fonts load via CSS in index.html, so before drawing any text we wait for
 * `document.fonts.ready` (with a hard timeout so the game never hangs on a
 * slow/blocked font CDN — text just falls back to the system font).
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  create(): void {
    this.cameras.main.setBackgroundColor(THEME.sceneBg);
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "Loading…", {
        fontFamily: "Nunito, sans-serif",
        fontSize: "28px",
        color: THEME.text,
      })
      .setOrigin(0.5);

    const fontsReady: Promise<unknown> =
      typeof document !== "undefined" && document.fonts
        ? Promise.race([
            document.fonts.ready,
            new Promise((resolve) => this.time.delayedCall(2000, resolve)),
          ])
        : Promise.resolve();

    Promise.all([GameContent.fetchData(), fontsReady])
      .then(([content]) => {
        this.registry.set("content", content);
        this.registry.set("stageIndex", 0);
        this.scene.start("Preload");
      })
      .catch((err) => {
        this.add
          .text(
            GAME_WIDTH / 2,
            GAME_HEIGHT / 2 + 40,
            `Failed to load content:\n${err}`,
            {
              fontFamily: "Nunito, sans-serif",
              fontSize: "16px",
              color: "#c62828",
              align: "center",
              wordWrap: { width: GAME_WIDTH - 80 },
            }
          )
          .setOrigin(0.5);
      });
  }
}
