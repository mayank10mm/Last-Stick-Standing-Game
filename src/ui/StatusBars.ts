import Phaser from "phaser";
import type { Fighter } from "../Fighter";
import { FONTS } from "../theme";

/**
 * The top-of-screen HUD for one fighter: name, HP bar, and stamina bar.
 * `align` decides which corner it anchors to and which way the bars drain.
 *
 * Bars are drawn with Phaser Graphics so they can have rounded corners
 * (Phaser's Rectangle shape has no corner radius).
 */
export class StatusBars {
  private fighter: Fighter;

  private readonly barWidth = 360;
  private readonly hpHeight = 22;
  private readonly hpRadius = 10;
  private readonly staminaHeight = 12;
  private readonly staminaRadius = 5;

  private hpFill!: Phaser.GameObjects.Graphics;
  private staminaFill!: Phaser.GameObjects.Graphics;
  /** Cached bar geometry: [x, hpY, staminaY, originX] — set in the constructor. */
  private x!: number;
  private hpY!: number;
  private staminaY!: number;
  private originX!: 0 | 1;

  constructor(
    scene: Phaser.Scene,
    fighter: Fighter,
    align: "left" | "right"
  ) {
    this.fighter = fighter;

    const margin = 24;
    const topY = 22;
    this.x = align === "left" ? margin : scene.scale.width - margin - this.barWidth;
    this.hpY = topY;
    this.staminaY = topY + 28;
    this.originX = align === "left" ? 0 : 1;

    // Name above the bars.
    const nameX = this.originX === 0 ? this.x : this.x + this.barWidth;
    scene.add
      .text(nameX, topY - 6, fighter.def.name.toUpperCase(), {
        fontFamily: `${FONTS.display}, cursive`,
        fontSize: "22px",
        color: "#1e2836",
      })
      .setOrigin(this.originX, 1)
      .setScrollFactor(0)
      .setDepth(900);

    // Dark track behind each bar.
    this.drawRoundedBar(
      scene.add.graphics().setScrollFactor(0).setDepth(900),
      this.x,
      this.hpY,
      this.barWidth,
      this.hpHeight,
      this.hpRadius,
      0x2b3849,
      0.92
    );
    this.drawRoundedBar(
      scene.add.graphics().setScrollFactor(0).setDepth(900),
      this.x,
      this.staminaY,
      this.barWidth,
      this.staminaHeight,
      this.staminaRadius,
      0x2b3849,
      0.92
    );

    // Fills redrawn every frame.
    this.hpFill = scene.add.graphics().setScrollFactor(0).setDepth(901);
    this.staminaFill = scene.add.graphics().setScrollFactor(0).setDepth(901);
  }

  /** Draw one static rounded rectangle (the track behind a bar). */
  private drawRoundedBar(
    g: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    w: number,
    h: number,
    radius: number,
    color: number,
    alpha: number
  ): void {
    g.fillStyle(color, alpha);
    g.fillRoundedRect(x, y, w, h, radius);
  }

  /** Draw the animated fill of a bar, anchored to the correct side. */
  private drawFill(
    g: Phaser.GameObjects.Graphics,
    y: number,
    h: number,
    radius: number,
    pct: number,
    color: number
  ): void {
    g.clear();
    if (pct <= 0) return;
    const w = Math.max(2 * radius, this.barWidth * pct);
    const x = this.originX === 0 ? this.x : this.x + this.barWidth - w;
    // Shrink the radius for tiny fills so the pill never self-intersects.
    const r = Math.min(radius, w / 2, h / 2);
    g.fillStyle(color, 1);
    g.fillRoundedRect(x, y, w, h, r);
  }

  /** Call every frame to reflect the fighter's current HP/stamina. */
  update(): void {
    const hpPct = Phaser.Math.Clamp(this.fighter.hp / this.fighter.stats.maxHp, 0, 1);
    const stPct = Phaser.Math.Clamp(
      this.fighter.stamina / this.fighter.stats.maxStamina,
      0,
      1
    );

    // HP shifts red -> deep orange -> dark red as it drops.
    const hpColor = hpPct > 0.5 ? 0xe53935 : hpPct > 0.25 ? 0xd84315 : 0xb71c1c;
    this.drawFill(this.hpFill, this.hpY, this.hpHeight, this.hpRadius, hpPct, hpColor);
    this.drawFill(
      this.staminaFill,
      this.staminaY,
      this.staminaHeight,
      this.staminaRadius,
      stPct,
      0xf9a825
    );
  }
}
