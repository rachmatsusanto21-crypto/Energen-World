import Phaser from 'phaser';
import { soundEngine } from './audio';
import { LEVELS_META } from './content';
import { gameBus } from './eventBus';
import { LEVEL_BLUEPRINTS, LevelBlueprint } from './levelData';
import { createGameTextures } from './textures';
import { HudSnapshot, LevelId } from './types';

interface MovingPlatformRuntime {
  sprite: Phaser.GameObjects.Rectangle;
  visual: Phaser.GameObjects.TileSprite;
  startX: number;
  startY: number;
  axis: 'x' | 'y';
  range: number;
  speed: number;
  dir: number;
  prevX: number;
  prevY: number;
  dx: number;
  dy: number;
}

interface ConveyorRuntime {
  x: number;
  y: number;
  w: number;
  speed: number;
  sprites: Phaser.GameObjects.Image[];
}

interface EnemyRuntime {
  sprite: Phaser.Physics.Arcade.Sprite;
  minX: number;
  maxX: number;
  speed: number;
  alive: boolean;
}

export class PlayScene extends Phaser.Scene {
  private levelId: LevelId = 1;
  private blueprint!: LevelBlueprint;

  private player!: Phaser.Physics.Arcade.Sprite;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private movingPlatforms: MovingPlatformRuntime[] = [];
  private conveyors: ConveyorRuntime[] = [];
  private collectibles!: Phaser.Physics.Arcade.Group;
  private symbolItems!: Phaser.Physics.Arcade.Group;
  private enemies: EnemyRuntime[] = [];
  private projectiles!: Phaser.Physics.Arcade.Group;

  private checkpointSprite!: Phaser.Physics.Arcade.Sprite;
  private gateSprite!: Phaser.Physics.Arcade.Sprite;
  private miniGameSprite?: Phaser.Physics.Arcade.Sprite;
  private bossSprite?: Phaser.Physics.Arcade.Sprite;
  private bossBeacon?: Phaser.Physics.Arcade.Sprite;
  private malkiNpcs: { sprite: Phaser.Physics.Arcade.Sprite; title: string; lines: string[]; talked: boolean }[] = [];

  private lives = 3;
  private score = 0;
  private itemsCollected = 0;
  private symbolsCollected: string[] = [];
  private checkpointReached = false;
  private respawnPoint = { x: 100, y: 390 };
  private miniGameDone = false;
  private quizDone = false;
  private quizCorrectCount = 0;
  private gateOpen = false;
  private invulnerableUntil = 0;
  private interactionCooldownUntil = 0;
  private isPausedModal = false;
  private levelFinished = false;

  // Boss state
  private bossHp = 300;
  private bossMaxHp = 300;
  private bossPhase: 1 | 2 | 3 = 1;
  private bossAttackTimer = 0;
  private lightningOverlay?: Phaser.GameObjects.Rectangle;
  private fogOverlay?: Phaser.GameObjects.Rectangle;

  // Input state
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: {
    a: Phaser.Input.Keyboard.Key;
    d: Phaser.Input.Keyboard.Key;
    w: Phaser.Input.Keyboard.Key;
    e: Phaser.Input.Keyboard.Key;
    space: Phaser.Input.Keyboard.Key;
    enter: Phaser.Input.Keyboard.Key;
    esc: Phaser.Input.Keyboard.Key;
    p: Phaser.Input.Keyboard.Key;
  };
  private touchState = { left: false, right: false, jump: false, interact: false };
  private lastGroundedTime = 0;
  private jumpBufferTime = 0;
  private prevJumpHeld = false;
  private prevInteractHeld = false;

  private conveyorAnimTick = 0;
  private conveyorFrame = 0;
  private lastNearbyPrompt: string | null = null;
  private nearbyActionCallback: (() => void) | null = null;
  private unsubscribes: (() => void)[] = [];
  private introShown = false;

  constructor() {
    super({ key: 'PlayScene' });
  }

  public init(data: { levelId?: LevelId }): void {
    this.levelId = data?.levelId ?? 1;
    this.blueprint = LEVEL_BLUEPRINTS[this.levelId];

    this.lives = 3;
    this.score = 0;
    this.itemsCollected = 0;
    this.symbolsCollected = [];
    this.checkpointReached = false;
    this.respawnPoint = { ...this.blueprint.spawn };
    this.miniGameDone = !this.blueprint.miniGameStation;
    this.quizDone = false;
    this.quizCorrectCount = 0;
    this.gateOpen = false;
    this.invulnerableUntil = 0;
    this.interactionCooldownUntil = 0;
    this.isPausedModal = false;
    this.levelFinished = false;

    this.bossHp = 300;
    this.bossMaxHp = 300;
    this.bossPhase = 1;
    this.bossAttackTimer = 0;

    this.movingPlatforms = [];
    this.conveyors = [];
    this.enemies = [];
    this.malkiNpcs = [];
    this.touchState = { left: false, right: false, jump: false, interact: false };
    this.lastGroundedTime = 0;
    this.jumpBufferTime = 0;
    this.prevJumpHeld = false;
    this.prevInteractHeld = false;
    this.lastNearbyPrompt = null;
    this.nearbyActionCallback = null;
    this.introShown = false;
  }

  public create(): void {
    createGameTextures(this);

    const W = this.blueprint.worldWidth;
    const H = 540;
    this.physics.world.setBounds(0, 0, W, H + 120);
    this.cameras.main.setBounds(0, 0, W, H);

    this.buildParallaxBackground(W, H);
    this.buildWorldGeometry();
    this.buildEntities();
    this.buildPlayer();
    this.setupInputs();
    this.setupEventSubscriptions();

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12, -80, 30);

    // Music mode
    soundEngine.setMusicMode(this.levelId === 4 ? 'boss' : 'adventure');

    this.emitHud();

    // Intro story dialog from Malki
    this.time.delayedCall(260, () => {
      if (!this.introShown && !this.levelFinished) {
        this.introShown = true;
        const meta = LEVELS_META[this.levelId];
        this.openModalPause();
        gameBus.emit('open-dialog', {
          speaker: meta.introDialog.speaker,
          title: `${meta.name} — ${meta.subtitle}`,
          lines: meta.introDialog.lines,
        });
      }
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.cleanupSubscriptions();
    });
    this.events.once(Phaser.Scenes.Events.DESTROY, () => {
      this.cleanupSubscriptions();
    });
  }

  private buildParallaxBackground(W: number, H: number): void {
    const bg = this.add.graphics().setScrollFactor(0);
    bg.fillGradientStyle(
      this.blueprint.skyTop,
      this.blueprint.skyTop,
      this.blueprint.skyBottom,
      this.blueprint.skyBottom,
      1
    );
    bg.fillRect(0, 0, 960, H);

    // Sun or Moon
    if (this.levelId !== 4) {
      const sun = this.add.circle(820, 95, 42, 0xfef08a, 0.95).setScrollFactor(0.05);
      sun.setStrokeStyle(6, 0xfde047, 0.45);
    } else {
      const moon = this.add.circle(820, 90, 36, 0xe9d5ff, 0.85).setScrollFactor(0.05);
      moon.setStrokeStyle(8, 0xa855f7, 0.3);
    }

    // Parallax Clouds
    for (let cx = 120; cx < W; cx += 340) {
      const cloud = this.add
        .image(cx, 80 + ((cx / 340) % 2) * 35, 'prop_cloud')
        .setScrollFactor(0.2)
        .setAlpha(this.levelId === 4 ? 0.28 : 0.88);
      if (this.levelId === 4) {
        cloud.setTint(0x7e22ce);
      }
    }

    // Distant hills / silhouettes
    const backHills = this.add.graphics().setScrollFactor(0.35);
    backHills.fillStyle(this.blueprint.hillColorBack, 0.8);
    for (let hx = -100; hx < W * 0.5 + 300; hx += 260) {
      if (this.levelId === 3) {
        // Factory skyline silhouettes
        backHills.fillRect(hx + 20, 270, 120, 270);
        backHills.fillRect(hx + 150, 310, 95, 230);
        backHills.fillTriangle(hx + 20, 270, hx + 80, 235, hx + 140, 270);
      } else if (this.levelId === 4) {
        // Castle towers
        backHills.fillRect(hx + 30, 240, 80, 300);
        backHills.fillTriangle(hx + 24, 240, hx + 70, 185, hx + 116, 240);
      } else {
        backHills.fillEllipse(hx + 130, 440, 340, 230);
      }
    }

    const frontHills = this.add.graphics().setScrollFactor(0.6);
    frontHills.fillStyle(this.blueprint.hillColorFront, 0.85);
    for (let hx = -60; hx < W * 0.75 + 300; hx += 280) {
      if (this.levelId === 3) {
        frontHills.fillRoundedRect(hx + 30, 355, 180, 195, 8);
      } else if (this.levelId === 4) {
        frontHills.fillRect(hx, 345, 210, 195);
      } else {
        frontHills.fillEllipse(hx + 140, 470, 360, 190);
      }
    }

    // Scenic trees & factory/castle details in world space (scrollFactor 1)
    if (this.levelId === 1 || this.levelId === 2) {
      for (let tx = 140; tx < W - 200; tx += 390) {
        const onWater = this.blueprint.waterZones.some((wz) => tx >= wz.x - 40 && tx <= wz.x + wz.w + 40);
        if (!onWater) {
          this.add.image(tx, 392, 'prop_tree').setDepth(1);
        }
      }
    }

    if (this.levelId === 3) {
      // Packaging machine arches in background
      const fx = this.add.graphics().setDepth(1);
      [580, 1080, 2040].forEach((mx) => {
        fx.fillStyle(0xf97316, 0.35);
        fx.fillRoundedRect(mx, 210, 160, 250, 14);
        fx.fillStyle(0xfef08a, 0.8);
        fx.fillRoundedRect(mx + 25, 235, 110, 28, 6);
      });
    }

    if (this.levelId === 4) {
      this.fogOverlay = this.add
        .rectangle(480, 270, 960, 540, 0x9333ea, 0)
        .setScrollFactor(0)
        .setDepth(50);
      this.lightningOverlay = this.add
        .rectangle(480, 270, 960, 540, 0xfef08a, 0)
        .setScrollFactor(0)
        .setDepth(51);

      // Periodic storm lightning
      this.time.addEvent({
        delay: 4200,
        loop: true,
        callback: () => {
          if (this.isPausedModal || !this.lightningOverlay) return;
          this.tweens.add({
            targets: this.lightningOverlay,
            alpha: { from: 0.32, to: 0 },
            duration: 240,
          });
        },
      });
    }
  }

  private buildWorldGeometry(): void {
    this.platforms = this.physics.add.staticGroup();

    // Water hazards visual
    this.blueprint.waterZones.forEach((wz) => {
      const water = this.add.tileSprite(wz.x + wz.w / 2, 520, wz.w, 40, 'tile_water').setDepth(4);
      this.tweens.add({
        targets: water,
        tilePositionX: 64,
        duration: 1800,
        repeat: -1,
      });
    });

    // Static platforms, bridges, conveyors
    this.blueprint.platforms.forEach((p) => {
      if (p.kind === 'bridge') {
        this.add.tileSprite(p.x + p.w / 2, p.y + p.h / 2, p.w, p.h, 'tile_bridge').setDepth(3);
      } else if (p.kind === 'conveyor') {
        const sprites: Phaser.GameObjects.Image[] = [];
        for (let cx = p.x + 32; cx < p.x + p.w; cx += 64) {
          const img = this.add.image(cx, p.y + p.h / 2, 'tile_conveyor_0').setDepth(3);
          if ((p.conveyorSpeed ?? 0) < 0) img.setFlipX(true);
          sprites.push(img);
        }
        this.conveyors.push({
          x: p.x,
          y: p.y,
          w: p.w,
          speed: p.conveyorSpeed ?? 90,
          sprites,
        });
      } else {
        this.add.tileSprite(p.x + p.w / 2, p.y + p.h / 2, p.w, p.h, this.blueprint.tileKey).setDepth(3);
      }

      const collider = this.add.rectangle(p.x + p.w / 2, p.y + p.h / 2, p.w, p.h);
      this.physics.add.existing(collider, true);
      this.platforms.add(collider);
    });

    // Moving platforms
    this.blueprint.movingPlatforms.forEach((mp) => {
      const visual = this.add
        .tileSprite(mp.x, mp.y, mp.w, mp.h, this.blueprint.tileKey)
        .setDepth(4);
      const rect = this.add.rectangle(mp.x, mp.y, mp.w, mp.h);
      this.physics.add.existing(rect, false);
      const body = rect.body as Phaser.Physics.Arcade.Body;
      body.setAllowGravity(false);
      body.setImmovable(true);

      this.movingPlatforms.push({
        sprite: rect,
        visual,
        startX: mp.x,
        startY: mp.y,
        axis: mp.axis,
        range: mp.range,
        speed: mp.speed,
        dir: 1,
        prevX: mp.x,
        prevY: mp.y,
        dx: 0,
        dy: 0,
      });
    });
  }

  private buildEntities(): void {
    // Checkpoint
    const cp = this.blueprint.checkpoint;
    this.checkpointSprite = this.physics.add
      .sprite(cp.x, cp.y - 38, 'flag_down')
      .setDepth(5)
      .setImmovable(true);
    (this.checkpointSprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

    // Exit Gate
    const gt = this.blueprint.gate;
    this.gateSprite = this.physics.add
      .sprite(gt.x, gt.y - 54, 'gate_closed')
      .setDepth(5)
      .setImmovable(true);
    (this.gateSprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

    // Mini-game station (Levels 2 & 3)
    if (this.blueprint.miniGameStation) {
      const ms = this.blueprint.miniGameStation;
      this.miniGameSprite = this.physics.add
        .sprite(ms.x, ms.y - 34, 'item_symbol')
        .setScale(1.15)
        .setTint(0x38bdf8)
        .setDepth(5);
      (this.miniGameSprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
      this.add
        .text(ms.x, ms.y - 74, ms.label, {
          fontFamily: 'Fredoka, sans-serif',
          fontSize: '14px',
          color: '#FFFFFF',
          stroke: '#1E110A',
          strokeThickness: 4,
        })
        .setOrigin(0.5)
        .setDepth(6);
    }

    // Collectibles
    this.collectibles = this.physics.add.group({ allowGravity: false });
    this.blueprint.collectibles.forEach((c, idx) => {
      const item = this.collectibles.create(c.x, c.y, this.blueprint.collectibleKey) as Phaser.Physics.Arcade.Sprite;
      item.setDepth(6);
      this.tweens.add({
        targets: item,
        y: c.y - 7,
        duration: 900 + (idx % 3) * 140,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });

    // Symbols
    this.symbolItems = this.physics.add.group({ allowGravity: false });
    this.blueprint.symbols.forEach((s, idx) => {
      const sym = this.symbolItems.create(s.x, s.y, 'item_symbol') as Phaser.Physics.Arcade.Sprite;
      sym.setData('label', s.label);
      sym.setDepth(6);
      const label = this.add
        .text(s.x, s.y - 32, s.label, {
          fontFamily: 'Fredoka, sans-serif',
          fontSize: '13px',
          color: '#FEF08A',
          stroke: '#451A03',
          strokeThickness: 4,
        })
        .setOrigin(0.5)
        .setDepth(6);
      sym.setData('textObj', label);

      this.tweens.add({
        targets: [sym, label],
        y: '-=8',
        duration: 1000 + idx * 120,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });

    // Enemies
    this.blueprint.enemies.forEach((e) => {
      const key = e.kind === 'candy' ? 'candy_0' : 'bot_0';
      const spr = this.physics.add.sprite(e.x, e.y, key).setDepth(7);
      (spr.body as Phaser.Physics.Arcade.Body).setAllowGravity(false).setSize(38, 38);
      spr.play(e.kind === 'candy' ? 'candy_walk' : 'bot_walk');
      this.enemies.push({
        sprite: spr,
        minX: e.minX,
        maxX: e.maxX,
        speed: e.speed,
        alive: true,
      });
    });

    // Malki NPCs
    this.blueprint.npcs.forEach((npc) => {
      const spr = this.physics.add.sprite(npc.x, npc.y - 42, 'malki_idle_0').setDepth(6);
      (spr.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
      spr.play('malki_idle');

      this.add
        .text(npc.x, npc.y - 92, 'Malki', {
          fontFamily: 'Fredoka, sans-serif',
          fontSize: '13px',
          color: '#FEF08A',
          stroke: '#451A03',
          strokeThickness: 4,
        })
        .setOrigin(0.5)
        .setDepth(6);

      this.malkiNpcs.push({
        sprite: spr,
        title: npc.title,
        lines: npc.lines,
        talked: false,
      });
    });

    // Boss (Level 4)
    this.projectiles = this.physics.add.group({ allowGravity: false });
    if (this.blueprint.hasBoss) {
      this.bossSprite = this.physics.add.sprite(1450, 388, 'boss_idle_0').setDepth(7);
      (this.bossSprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(false).setSize(86, 110);
      this.bossSprite.play('boss_idle');

      this.bossBeacon = this.physics.add.sprite(850, 424, 'boss_beacon').setDepth(6);
      (this.bossBeacon.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
      this.tweens.add({
        targets: this.bossBeacon,
        y: '-=10',
        duration: 750,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }

  private buildPlayer(): void {
    const sp = this.blueprint.spawn;
    this.player = this.physics.add.sprite(sp.x, sp.y, 'bobo_idle_0').setDepth(10);
    this.player.setCollideWorldBounds(true);

    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setGravityY(1200);
    body.setSize(38, 56);
    body.setOffset(21, 20);
    body.setMaxVelocity(320, 760);

    // Collisions
    this.physics.add.collider(this.player, this.platforms);
    this.movingPlatforms.forEach((mp) => {
      this.physics.add.collider(this.player, mp.sprite);
    });

    this.physics.add.overlap(this.player, this.collectibles, (_p, obj) => {
      const item = obj as Phaser.Physics.Arcade.Sprite;
      this.collectItem(item);
    });

    this.physics.add.overlap(this.player, this.symbolItems, (_p, obj) => {
      const sym = obj as Phaser.Physics.Arcade.Sprite;
      this.collectSymbol(sym);
    });

    this.physics.add.overlap(this.player, this.checkpointSprite, () => {
      if (!this.checkpointReached) {
        this.checkpointReached = true;
        this.respawnPoint = { x: this.blueprint.checkpoint.x, y: this.blueprint.checkpoint.y - 60 };
        this.checkpointSprite.setTexture('flag_up');
        this.score += 100;
        soundEngine.checkpoint();
        this.spawnFloatingText(this.checkpointSprite.x, this.checkpointSprite.y - 40, 'Checkpoint!', '#4ADE80');
        this.spawnBurst(this.checkpointSprite.x, this.checkpointSprite.y - 20, 0x4ade80);
        this.emitHud();
      }
    });

    // Enemy overlaps
    this.enemies.forEach((enemy) => {
      this.physics.add.overlap(this.player, enemy.sprite, () => {
        if (!enemy.alive || this.isPausedModal || this.levelFinished) return;
        const pBody = this.player.body as Phaser.Physics.Arcade.Body;
        const isStomp = pBody.velocity.y > 40 && this.player.y < enemy.sprite.y - 12;
        if (isStomp) {
          enemy.alive = false;
          pBody.setVelocityY(-420);
          this.score += 120;
          soundEngine.stomp();
          this.spawnBurst(enemy.sprite.x, enemy.sprite.y, 0xfacc15);
          this.spawnFloatingText(enemy.sprite.x, enemy.sprite.y - 25, '+120', '#FDE047');
          this.tweens.add({
            targets: enemy.sprite,
            scaleY: 0.2,
            alpha: 0,
            duration: 220,
            onComplete: () => enemy.sprite.destroy(),
          });
          this.emitHud();
        } else {
          this.damagePlayer();
        }
      });
    });

    // Boss projectile overlaps
    this.physics.add.overlap(this.player, this.projectiles, (_p, proj) => {
      proj.destroy();
      this.damagePlayer();
    });

    if (this.bossSprite) {
      this.physics.add.overlap(this.player, this.bossSprite, () => {
        if (this.bossHp > 0) {
          this.damagePlayer();
        }
      });
    }
  }

  private setupInputs(): void {
    if (!this.input.keyboard) return;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = {
      a: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      d: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      w: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      e: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      enter: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
      esc: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC),
      p: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P),
    };

    const onBlur = () => {
      this.touchState = { left: false, right: false, jump: false, interact: false };
    };
    window.addEventListener('blur', onBlur);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      window.removeEventListener('blur', onBlur);
    });
  }

  private setupEventSubscriptions(): void {
    this.cleanupSubscriptions();

    this.unsubscribes.push(
      gameBus.on('touch-input', ({ action, pressed }) => {
        this.touchState[action] = pressed;
      }),
      gameBus.on('pause-game', () => {
        this.openModalPause();
      }),
      gameBus.on('resume-game', () => {
        this.closeModalPause();
      }),
      gameBus.on('dialog-closed', () => {
        this.closeModalPause();
      }),
      gameBus.on('restart-level', () => {
        if (!this.sys || !this.sys.settings.active) return;
        this.scene.restart({ levelId: this.levelId });
      }),
      gameBus.on('minigame-completed', ({ levelId, bonusScore }) => {
        if (!this.sys || !this.sys.settings.active) return;
        if (levelId === this.levelId) {
          this.miniGameDone = true;
          this.score += bonusScore;
          if (this.miniGameSprite) {
            this.miniGameSprite.setTint(0x22c55e);
          }
          this.closeModalPause();
          this.emitHud();
        }
      }),
      gameBus.on('quiz-completed', ({ mode, phase, correctCount }) => {
        if (!this.sys || !this.sys.settings.active) return;
        this.quizCorrectCount += correctCount;
        this.score += correctCount * 100;

        if (mode === 'LEVEL_GATE') {
          this.quizDone = true;
          this.gateOpen = true;
          this.gateSprite.setTexture('gate_open');
          this.closeModalPause();
          this.finishLevelVictory();
        } else if (mode === 'BOSS_PHASE' && phase) {
          this.handleBossPhaseDefeated(phase);
          this.closeModalPause();
        }
      })
    );
  }

  private cleanupSubscriptions(): void {
    this.unsubscribes.forEach((u) => u());
    this.unsubscribes = [];
  }

  private openModalPause(): void {
    if (!this.sys || !this.sys.settings.active || !this.physics?.world) return;
    this.isPausedModal = true;
    this.physics.world.pause();
    this.touchState = { left: false, right: false, jump: false, interact: false };
  }

  private closeModalPause(): void {
    if (!this.sys || !this.sys.settings.active || !this.physics?.world) return;
    this.isPausedModal = false;
    this.interactionCooldownUntil = (this.time?.now ?? 0) + 1800;
    this.physics.world.resume();
  }

  public update(time: number, delta: number): void {
    const dt = Math.min(delta, 50) / 1000;

    if (this.keys && (Phaser.Input.Keyboard.JustDown(this.keys.esc) || Phaser.Input.Keyboard.JustDown(this.keys.p))) {
      if (!this.isPausedModal && !this.levelFinished) {
        this.openModalPause();
        gameBus.emit('pause-game', undefined);
      }
    }

    if (this.isPausedModal || this.levelFinished) return;

    this.updateMovingPlatforms(dt);
    this.updateConveyorVisuals(delta);
    this.updateEnemies(dt);
    this.updateBoss(time, dt);
    this.updatePlayerMovement(time);
    this.checkNearbyInteractions();

    // Pit / water fall check
    if (this.player.y > 555) {
      this.handlePitFall();
    }
  }

  private updateMovingPlatforms(dt: number): void {
    this.movingPlatforms.forEach((mp) => {
      mp.prevX = mp.sprite.x;
      mp.prevY = mp.sprite.y;

      if (mp.axis === 'x') {
        mp.sprite.x += mp.dir * mp.speed * dt;
        if (mp.sprite.x > mp.startX + mp.range) {
          mp.sprite.x = mp.startX + mp.range;
          mp.dir = -1;
        } else if (mp.sprite.x < mp.startX - mp.range) {
          mp.sprite.x = mp.startX - mp.range;
          mp.dir = 1;
        }
      } else {
        mp.sprite.y += mp.dir * mp.speed * dt;
        if (mp.sprite.y > mp.startY + mp.range) {
          mp.sprite.y = mp.startY + mp.range;
          mp.dir = -1;
        } else if (mp.sprite.y < mp.startY - mp.range) {
          mp.sprite.y = mp.startY - mp.range;
          mp.dir = 1;
        }
      }

      mp.dx = mp.sprite.x - mp.prevX;
      mp.dy = mp.sprite.y - mp.prevY;
      mp.visual.setPosition(mp.sprite.x, mp.sprite.y);
      const body = mp.sprite.body as Phaser.Physics.Arcade.Body;
      body.updateFromGameObject();
    });
  }

  private updateConveyorVisuals(delta: number): void {
    if (this.conveyors.length === 0) return;
    this.conveyorAnimTick += delta;
    if (this.conveyorAnimTick >= 110) {
      this.conveyorAnimTick = 0;
      this.conveyorFrame = (this.conveyorFrame + 1) % 3;
      this.conveyors.forEach((c) => {
        c.sprites.forEach((spr) => spr.setTexture(`tile_conveyor_${this.conveyorFrame}`));
      });
    }
  }

  private updateEnemies(dt: number): void {
    this.enemies.forEach((enemy) => {
      if (!enemy.alive) return;
      enemy.sprite.x += enemy.speed * dt;
      if (enemy.sprite.x >= enemy.maxX) {
        enemy.sprite.x = enemy.maxX;
        enemy.speed = -Math.abs(enemy.speed);
        enemy.sprite.setFlipX(true);
      } else if (enemy.sprite.x <= enemy.minX) {
        enemy.sprite.x = enemy.minX;
        enemy.speed = Math.abs(enemy.speed);
        enemy.sprite.setFlipX(false);
      }
      (enemy.sprite.body as Phaser.Physics.Arcade.Body).updateFromGameObject();
    });
  }

  private updateBoss(time: number, dt: number): void {
    if (!this.blueprint.hasBoss || !this.bossSprite || this.bossHp <= 0) return;

    this.bossAttackTimer += dt;
    const attackInterval = this.bossPhase === 1 ? 2.1 : this.bossPhase === 2 ? 1.85 : 1.55;

    if (this.bossAttackTimer >= attackInterval) {
      this.bossAttackTimer = 0;
      this.bossSprite.setTexture('boss_attack');
      this.time.delayedCall(320, () => {
        if (this.bossSprite && this.bossHp > 0) {
          this.bossSprite.play('boss_idle', true);
        }
      });

      const projKey =
        this.bossPhase === 1 ? 'proj_hunger' : this.bossPhase === 2 ? 'proj_weak' : 'proj_fog';

      const spawnProjectile = (vy: number, speedX: number) => {
        const proj = this.projectiles.create(this.bossSprite!.x - 42, this.bossSprite!.y + 10, projKey) as Phaser.Physics.Arcade.Sprite;
        proj.setDepth(8);
        const pb = proj.body as Phaser.Physics.Arcade.Body;
        pb.setVelocity(speedX, vy);
        this.time.delayedCall(3800, () => {
          if (proj.active) proj.destroy();
        });
      };

      if (this.bossPhase === 1) {
        spawnProjectile(-25, -240);
      } else if (this.bossPhase === 2) {
        spawnProjectile(-120, -255);
        spawnProjectile(10, -220);
      } else {
        spawnProjectile(-140, -270);
        spawnProjectile(-15, -260);
        if (this.fogOverlay) {
          this.tweens.add({
            targets: this.fogOverlay,
            alpha: { from: 0.28, to: 0.05 },
            duration: 900,
          });
        }
      }
    }

    // Gentle boss hover bob
    this.bossSprite.y = 388 + Math.sin(time / 380) * 6;
  }

  private updatePlayerMovement(time: number): void {
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const grounded = body.blocked.down || body.touching.down;
    if (grounded) {
      this.lastGroundedTime = time;
    }

    const leftHeld = this.cursors?.left.isDown || this.keys?.a.isDown || this.touchState.left;
    const rightHeld = this.cursors?.right.isDown || this.keys?.d.isDown || this.touchState.right;
    const jumpHeld =
      this.cursors?.up.isDown || this.keys?.w.isDown || this.keys?.space.isDown || this.touchState.jump;

    const jumpJustPressed = jumpHeld && !this.prevJumpHeld;
    this.prevJumpHeld = jumpHeld;

    if (jumpJustPressed) {
      this.jumpBufferTime = time;
    }

    // Horizontal velocity + conveyor push
    let moveSpeed = 0;
    if (leftHeld && !rightHeld) {
      moveSpeed = -260;
      this.player.setFlipX(true);
    } else if (rightHeld && !leftHeld) {
      moveSpeed = 260;
      this.player.setFlipX(false);
    }

    let conveyorPush = 0;
    if (grounded) {
      for (const c of this.conveyors) {
        if (
          this.player.x >= c.x &&
          this.player.x <= c.x + c.w &&
          Math.abs(body.bottom - c.y) <= 14
        ) {
          conveyorPush = c.speed;
          break;
        }
      }

      // Moving platform rider sync
      for (const mp of this.movingPlatforms) {
        const mBody = mp.sprite.body as Phaser.Physics.Arcade.Body;
        if (
          this.player.x >= mBody.left - 12 &&
          this.player.x <= mBody.right + 12 &&
          Math.abs(body.bottom - mBody.top) <= 14
        ) {
          this.player.x += mp.dx;
          this.player.y += mp.dy;
          break;
        }
      }
    }

    body.setVelocityX(moveSpeed + conveyorPush);

    // Coyote time + Jump buffer
    const canCoyote = time - this.lastGroundedTime <= 115;
    const hasBufferedJump = time - this.jumpBufferTime <= 130;

    if (canCoyote && hasBufferedJump) {
      body.setVelocityY(-565);
      this.lastGroundedTime = 0;
      this.jumpBufferTime = 0;
      soundEngine.jump();
      this.spawnBurst(this.player.x, this.player.y + 26, 0xffffff, 4);
    }

    // Variable jump cut
    if (!jumpHeld && body.velocity.y < -200) {
      body.setVelocityY(body.velocity.y * 0.88);
    }

    // Animations
    if (time < this.invulnerableUntil - 900) {
      this.player.setTexture('bobo_hurt');
    } else if (!grounded) {
      this.player.setTexture('bobo_jump');
    } else if (Math.abs(moveSpeed) > 10) {
      this.player.play('bobo_walk', true);
    } else {
      this.player.play('bobo_idle', true);
    }
  }

  private checkNearbyInteractions(): void {
    const interactHeld =
      this.keys?.e.isDown || this.keys?.enter.isDown || this.touchState.interact;
    const interactJustPressed = interactHeld && !this.prevInteractHeld;
    this.prevInteractHeld = interactHeld;

    let prompt: string | null = null;
    let action: (() => void) | null = null;

    // 1. Check Malki NPCs
    for (const npc of this.malkiNpcs) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.sprite.x, npc.sprite.y);
      if (dist < 85) {
        prompt = 'Bicara dengan Malki';
        action = () => {
          soundEngine.click();
          this.openModalPause();
          gameBus.emit('open-dialog', {
            speaker: 'Malki',
            title: npc.title,
            lines: npc.lines,
          });
        };
        break;
      }
    }

    // 2. Check Mini-Game Station (Level 2 & 3)
    if (!action && this.miniGameSprite && !this.miniGameDone) {
      const dist = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.miniGameSprite.x,
        this.miniGameSprite.y
      );
      if (dist < 82) {
        prompt = this.levelId === 2 ? 'Susun Menu Sarapan!' : 'Baca Label & Menu!';
        action = () => {
          soundEngine.click();
          this.openModalPause();
          gameBus.emit('open-minigame', { levelId: this.levelId as 2 | 3 });
        };
      }
    }

    // 3. Check Boss Challenge Beacon (Level 4)
    if (!action && this.bossBeacon && this.bossHp > 0) {
      const dist = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.bossBeacon.x,
        this.bossBeacon.y
      );
      if (dist < 82) {
        prompt = `Hadapi Tantangan Fase ${this.bossPhase}!`;
        action = () => {
          soundEngine.click();
          this.openModalPause();
          gameBus.emit('open-quiz', {
            levelId: 4,
            mode: 'BOSS_PHASE',
            phase: this.bossPhase,
          });
        };
      }
    }

    // 4. Check Exit Gate (Levels 1, 2, 3)
    if (!action && !this.blueprint.hasBoss) {
      const dist = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.gateSprite.x,
        this.gateSprite.y
      );
      if (dist < 86) {
        if (!this.miniGameDone && this.blueprint.miniGameStation) {
          prompt = 'Selesaikan Pos Mini-Game dulu!';
          action = () => {
            this.openModalPause();
            gameBus.emit('open-dialog', {
              speaker: 'Malki',
              title: 'Satu Langkah Lagi!',
              lines: [
                `Sebelum masuk ke gerbang, yuk mampir dulu ke ${this.blueprint.miniGameStation!.label} tepat di sebelah kiri gerbang!`,
              ],
            });
          };
        } else if (!this.quizDone) {
          prompt = 'Mulai Kuis Gerbang!';
          action = () => {
            soundEngine.click();
            this.openModalPause();
            gameBus.emit('open-quiz', {
              levelId: this.levelId,
              mode: 'LEVEL_GATE',
            });
          };
        }
      }
    }

    this.nearbyActionCallback = action;
    if (prompt !== this.lastNearbyPrompt) {
      this.lastNearbyPrompt = prompt;
      this.emitHud();
    }

    // Auto-trigger key stations/beacons/gate on close contact when not on cooldown
    const canAutoTrigger = this.time.now > this.interactionCooldownUntil;
    if (canAutoTrigger && action && !this.malkiNpcs.some((n) => Phaser.Math.Distance.Between(this.player.x, this.player.y, n.sprite.x, n.sprite.y) < 85)) {
      if (this.miniGameSprite && !this.miniGameDone && Phaser.Math.Distance.Between(this.player.x, this.player.y, this.miniGameSprite.x, this.miniGameSprite.y) < 42) {
        action();
        return;
      }
      if (this.bossBeacon && this.bossHp > 0 && Phaser.Math.Distance.Between(this.player.x, this.player.y, this.bossBeacon.x, this.bossBeacon.y) < 44) {
        action();
        return;
      }
      if (!this.blueprint.hasBoss && !this.quizDone && this.miniGameDone && Phaser.Math.Distance.Between(this.player.x, this.player.y, this.gateSprite.x, this.gateSprite.y) < 48) {
        action();
        return;
      }
    }

    if (interactJustPressed && this.nearbyActionCallback) {
      this.nearbyActionCallback();
    }
  }

  private collectItem(item: Phaser.Physics.Arcade.Sprite): void {
    item.disableBody(true, true);
    this.itemsCollected += 1;
    this.score += 50;
    soundEngine.collect();
    this.spawnBurst(item.x, item.y, 0xfde047);
    this.spawnFloatingText(item.x, item.y - 16, '+50', '#FEF08A');
    this.emitHud();
  }

  private collectSymbol(sym: Phaser.Physics.Arcade.Sprite): void {
    const label = sym.getData('label') as string;
    const textObj = sym.getData('textObj') as Phaser.GameObjects.Text | undefined;
    sym.disableBody(true, true);
    if (textObj) textObj.destroy();

    if (!this.symbolsCollected.includes(label)) {
      this.symbolsCollected.push(label);
    }
    this.score += 150;
    soundEngine.symbol();
    this.spawnBurst(sym.x, sym.y, 0x38bdf8, 12);
    this.spawnFloatingText(sym.x, sym.y - 22, `Simbol: ${label}!`, '#FFFFFF');
    this.emitHud();
  }

  private damagePlayer(): void {
    const now = this.time.now;
    if (now < this.invulnerableUntil || this.levelFinished) return;

    this.invulnerableUntil = now + 1350;
    this.lives = Math.max(0, this.lives - 1);
    soundEngine.hurt();
    this.cameras.main.shake(180, 0.012);

    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setVelocityY(-340);

    this.tweens.add({
      targets: this.player,
      alpha: 0.35,
      yoyo: true,
      repeat: 5,
      duration: 110,
      onComplete: () => {
        if (this.player) this.player.setAlpha(1);
      },
    });

    this.emitHud();
    if (this.lives <= 0) {
      this.triggerGameOver();
    }
  }

  private handlePitFall(): void {
    this.lives = Math.max(0, this.lives - 1);
    soundEngine.hurt();
    this.cameras.main.shake(180, 0.014);
    this.emitHud();

    if (this.lives <= 0) {
      this.triggerGameOver();
      return;
    }

    this.invulnerableUntil = this.time.now + 1200;
    this.player.setPosition(this.respawnPoint.x, this.respawnPoint.y);
    (this.player.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
  }

  private handleBossPhaseDefeated(phase: 1 | 2 | 3): void {
    this.bossHp = Math.max(0, this.bossHp - 100);
    soundEngine.bossHit();
    this.cameras.main.shake(260, 0.02);

    if (this.bossSprite) {
      this.bossSprite.setTexture('boss_hurt');
      this.spawnBurst(this.bossSprite.x, this.bossSprite.y, 0xfacc15, 18);
      this.spawnFloatingText(this.bossSprite.x, this.bossSprite.y - 70, '-100 HP!', '#F87171');
    }

    if (phase < 3 && this.bossHp > 0) {
      this.bossPhase = (phase + 1) as 1 | 2 | 3;
      this.time.delayedCall(600, () => {
        if (this.bossSprite && this.bossHp > 0) {
          this.bossSprite.play('boss_idle', true);
        }
      });

      // Move Challenge Beacon to next tactical spot
      if (this.bossBeacon) {
        const nextPos = this.bossPhase === 2 ? { x: 1070, y: 256 } : { x: 1285, y: 332 };
        this.bossBeacon.setPosition(nextPos.x, nextPos.y);
        this.spawnBurst(nextPos.x, nextPos.y, 0xa855f7, 12);
      }
      this.emitHud();
    } else {
      // Boss defeated!
      this.quizDone = true;
      this.gateOpen = true;
      this.gateSprite.setTexture('gate_open');
      if (this.bossBeacon) this.bossBeacon.destroy();
      if (this.fogOverlay) this.fogOverlay.setAlpha(0);

      if (this.bossSprite) {
        this.tweens.add({
          targets: this.bossSprite,
          scale: 0.1,
          alpha: 0,
          angle: 360,
          duration: 750,
          onComplete: () => {
            this.bossSprite?.destroy();
            this.finishLevelVictory();
          },
        });
      } else {
        this.finishLevelVictory();
      }
      this.emitHud();
    }
  }

  private finishLevelVictory(): void {
    if (this.levelFinished) return;
    this.levelFinished = true;
    this.isPausedModal = true;
    this.physics.world.pause();
    this.player.setTexture('bobo_win');
    soundEngine.victory();

    // Calculate stars (1 to 3)
    const meta = LEVELS_META[this.levelId];
    const itemRatio = meta.collectibleTarget > 0 ? this.itemsCollected / meta.collectibleTarget : 1;
    const symbolRatio =
      meta.symbolLabels.length > 0 ? this.symbolsCollected.length / meta.symbolLabels.length : 1;

    let stars = 1;
    if (itemRatio >= 0.6 && this.quizCorrectCount >= 2) stars = 2;
    if (itemRatio >= 0.85 && symbolRatio >= 1 && this.quizCorrectCount >= 3) stars = 3;
    // Reward full marks in Level 4 on boss defeat with remaining lives
    if (this.levelId === 4 && this.lives >= 2) stars = 3;

    const finalScore = this.score + this.lives * 100;
    this.emitHud();

    this.time.delayedCall(650, () => {
      gameBus.emit('level-complete', {
        levelId: this.levelId,
        score: finalScore,
        stars,
        itemsCollected: this.itemsCollected,
        quizCorrect: this.quizCorrectCount,
      });
    });
  }

  private triggerGameOver(): void {
    if (this.levelFinished) return;
    this.levelFinished = true;
    this.isPausedModal = true;
    this.physics.world.pause();
    gameBus.emit('game-over', {
      levelId: this.levelId,
      score: this.score,
    });
  }

  private spawnBurst(x: number, y: number, tint: number, count = 8): void {
    for (let i = 0; i < count; i++) {
      const p = this.add.image(x, y, 'fx_star').setTint(tint).setDepth(20);
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const dist = 24 + Math.random() * 34;
      this.tweens.add({
        targets: p,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0,
        scale: 0.2,
        duration: 420,
        onComplete: () => p.destroy(),
      });
    }
  }

  private spawnFloatingText(x: number, y: number, msg: string, color: string): void {
    const txt = this.add
      .text(x, y, msg, {
        fontFamily: 'Fredoka, sans-serif',
        fontSize: '18px',
        color,
        stroke: '#1E110A',
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(25);
    this.tweens.add({
      targets: txt,
      y: y - 34,
      alpha: 0,
      duration: 850,
      onComplete: () => txt.destroy(),
    });
  }

  private emitHud(): void {
    const meta = LEVELS_META[this.levelId];
    const phaseName =
      this.bossPhase === 1
        ? 'Fase 1: Serangan Rasa Lapar'
        : this.bossPhase === 2
          ? 'Fase 2: Serangan Tubuh Lemas'
          : 'Fase 3: Kabut Sulit Konsentrasi';

    const snapshot: HudSnapshot = {
      levelId: this.levelId,
      lives: this.lives,
      score: this.score,
      itemsCollected: this.itemsCollected,
      itemsTarget: meta.collectibleTarget,
      symbolsCollected: [...this.symbolsCollected],
      symbolsRequired: meta.symbolLabels,
      checkpointReached: this.checkpointReached,
      miniGameDone: this.miniGameDone,
      quizDone: this.quizDone,
      gateOpen: this.gateOpen,
      nearbyPrompt: this.lastNearbyPrompt,
      ...(this.blueprint.hasBoss
        ? {
            bossHp: this.bossHp,
            bossMaxHp: this.bossMaxHp,
            bossPhase: this.bossPhase,
            bossPhaseName: phaseName,
          }
        : {}),
    };
    gameBus.emit('hud-update', snapshot);
  }
}
