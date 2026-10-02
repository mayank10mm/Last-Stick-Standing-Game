import Phaser from "phaser";
import { GAME_WIDTH } from "../config";
import { GameContent } from "../ContentLoader";
import { FONTS, THEME } from "../theme";

/** Title screen: logo, hero preview, and a HOW TO PLAY panel. */
export class MenuScene extends Phaser.Scene {
  constructor() {
    super("Menu");
  }

  create(): void {
    const content = this.registry.get("content") as GameContent;
    this.cameras.main.setBackgroundColor(THEME.sceneBg);

    this.add
      .text(GAME_WIDTH / 2, 95, "LAST STICK STANDING", {
        fontFamily: `${FONTS.display}, cursive`,
        fontSize: "64px",
        color: THEME.accent,
      })
      .setOrigin(0.5);

    this.add
      .text(
        GAME_WIDTH / 2,
        155,
        `${content.campaign.stages.length} stages · defeat them all`,
        {
          fontFamily: `${FONTS.body}, sans-serif`,
          fontSize: "20px",
          color: THEME.textMuted,
        }
      )
      .setOrigin(0.5);

    this.buildHowToPlay(content);

    const prompt = this.add
      .text(GAME_WIDTH / 2, 502, "TAP / PRESS ANY KEY TO START", {
        fontFamily: `${FONTS.body}, sans-serif`,
        fontSize: "22px",
        color: THEME.text,
        fontStyle: "800",
      })
      .setOrigin(0.5);
    this.tweens.add({ targets: prompt, alpha: 0.3, duration: 700, yoyo: true, repeat: -1 });

    const start = () => {
      this.registry.set("stageIndex", 0);
      this.scene.start("Fight");
    };
    this.input.once("pointerdown", start);
    this.input.keyboard?.once("keydown", start);
  }

  /** Rounded white panel with the controls (two columns) and combat rules. */
  private buildHowToPlay(content: GameContent): void {
    const panelX = 140;
    const panelY = 185;
    const panelW = GAME_WIDTH - panelX * 2;
    const panelH = 270;

    // Behind everything else — the panel's own texts use the default depth 0.
    const panel = this.add.graphics().setDepth(-1);
    panel.fillStyle(0xffffff, 0.95);
    panel.fillRoundedRect(panelX, panelY, panelW, panelH, 16);
    panel.lineStyle(2, 0xd0d9e4, 1);
    panel.strokeRoundedRect(panelX, panelY, panelW, panelH, 16);

    const isTouch = this.sys.game.device.input.touch;

    this.add
      .text(GAME_WIDTH / 2, panelY + 26, "HOW TO PLAY", {
        fontFamily: `${FONTS.display}, cursive`,
        fontSize: "26px",
        color: THEME.accent,
      })
      .setOrigin(0.5);

    // Left column: hero preview.
    const player = content.getCharacter(content.campaign.player);
    this.add
      .image(panelX + 120, panelY + 135, GameContent.textureKey(player))
      .setScale(0.8)
      .setTint(
        player.tint ? Phaser.Display.Color.HexStringToColor(player.tint).color : 0xffffff
      );
    this.add
      .text(panelX + 120, panelY + panelH - 24, player.name.toUpperCase(), {
        fontFamily: `${FONTS.display}, cursive`,
        fontSize: "20px",
        color: THEME.text,
      })
      .setOrigin(0.5);

    // Right column: controls + rules.
    const colX = panelX + 235;
    const colW = panelX + panelW - colX - 24;
    const rows: string[][] = isTouch
      ? [
          ["Move", "◀ / ▶ buttons"],
          ["Jump", "JUMP button"],
          ["Guard", "hold GRD"],
          ["Light / Heavy", "A / B"],
          ["Special", "SP"],
        ]
      : [
          ["Move", "A / D  or  ← / →"],
          ["Jump", "W / Space"],
          ["Guard", "hold S / ↓"],
          ["Light / Heavy", "J / K"],
          ["Special", "L"],
        ];

    let y = panelY + 68;
    for (const [label, keys] of rows) {
      this.add
        .text(colX, y, label.toUpperCase(), {
          fontFamily: `${FONTS.body}, sans-serif`,
          fontSize: "15px",
          color: THEME.textMuted,
          fontStyle: "800",
        })
        .setOrigin(0, 0.5);
      this.add
        .text(colX + colW, y, keys, {
          fontFamily: `${FONTS.body}, sans-serif`,
          fontSize: "15px",
          color: THEME.text,
          fontStyle: "800",
          align: "right",
        })
        .setOrigin(1, 0.5);
      y += 28;
    }

    const rules = [
      "Guard blocks ~70% damage but drains stamina.",
      "Attacks cost stamina — it regenerates when idle.",
    ];
    y += 6;
    for (const rule of rules) {
      this.add
        .text(colX, y, `•  ${rule}`, {
          fontFamily: `${FONTS.body}, sans-serif`,
          fontSize: "13px",
          color: THEME.textFaint,
          wordWrap: { width: colW },
        })
        .setOrigin(0, 0.5);
      y += 22;
    }
  }
}
