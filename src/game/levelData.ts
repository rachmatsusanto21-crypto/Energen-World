import { LevelId } from './types';

export interface PlatformDef {
  x: number;
  y: number;
  w: number;
  h: number;
  kind: 'ground' | 'ledge' | 'bridge' | 'conveyor';
  conveyorSpeed?: number;
}

export interface MovingPlatformDef {
  x: number;
  y: number;
  w: number;
  h: number;
  axis: 'x' | 'y';
  range: number;
  speed: number;
}

export interface CollectibleDef {
  x: number;
  y: number;
}

export interface SymbolDef {
  x: number;
  y: number;
  label: string;
}

export interface EnemyDef {
  x: number;
  y: number;
  minX: number;
  maxX: number;
  speed: number;
  kind: 'candy' | 'bot';
}

export interface MalkiNpcDef {
  x: number;
  y: number;
  title: string;
  lines: string[];
}

export interface LevelBlueprint {
  id: LevelId;
  worldWidth: number;
  skyTop: number;
  skyBottom: number;
  hillColorBack: number;
  hillColorFront: number;
  tileKey: 'tile_grass' | 'tile_orchard' | 'tile_factory' | 'tile_castle';
  collectibleKey: 'item_cocoa' | 'item_fruit' | 'item_energen' | 'item_crystal';
  spawn: { x: number; y: number };
  checkpoint: { x: number; y: number };
  gate: { x: number; y: number };
  miniGameStation?: { x: number; y: number; label: string };
  platforms: PlatformDef[];
  movingPlatforms: MovingPlatformDef[];
  waterZones: { x: number; w: number }[];
  collectibles: CollectibleDef[];
  symbols: SymbolDef[];
  enemies: EnemyDef[];
  npcs: MalkiNpcDef[];
  hasBoss?: boolean;
}

export const LEVEL_BLUEPRINTS: Record<LevelId, LevelBlueprint> = {
  1: {
    id: 1,
    worldWidth: 2800,
    skyTop: 0x38bdf8,
    skyBottom: 0xbaf2ff,
    hillColorBack: 0x34d399,
    hillColorFront: 0x16a34a,
    tileKey: 'tile_grass',
    collectibleKey: 'item_cocoa',
    spawn: { x: 100, y: 390 },
    checkpoint: { x: 1360, y: 460 },
    gate: { x: 2640, y: 460 },
    platforms: [
      { x: 0, y: 460, w: 680, h: 80, kind: 'ground' },
      { x: 350, y: 375, w: 150, h: 28, kind: 'ledge' },
      // Wooden bridge over river (680..920)
      { x: 680, y: 460, w: 240, h: 24, kind: 'bridge' },
      { x: 920, y: 460, w: 560, h: 80, kind: 'ground' },
      { x: 1020, y: 370, w: 160, h: 28, kind: 'ledge' },
      { x: 1210, y: 290, w: 150, h: 28, kind: 'ledge' },
      // Gap (1480..1600) -> small stepping platform
      { x: 1600, y: 460, w: 420, h: 80, kind: 'ground' },
      { x: 1730, y: 370, w: 160, h: 28, kind: 'ledge' },
      { x: 1930, y: 295, w: 150, h: 28, kind: 'ledge' },
      // Second gap (2020..2150)
      { x: 2150, y: 460, w: 650, h: 80, kind: 'ground' },
      { x: 2240, y: 375, w: 150, h: 28, kind: 'ledge' },
    ],
    movingPlatforms: [],
    waterZones: [
      { x: 680, w: 240 },
      { x: 1480, w: 120 },
      { x: 2020, w: 130 },
    ],
    collectibles: [
      { x: 260, y: 420 },
      { x: 400, y: 335 },
      { x: 455, y: 335 },
      { x: 750, y: 410 },
      { x: 840, y: 410 },
      { x: 1085, y: 330 },
      { x: 1275, y: 250 },
      { x: 1795, y: 330 },
      { x: 1995, y: 255 },
      { x: 2310, y: 335 },
    ],
    symbols: [
      { x: 430, y: 285, label: 'Energi' },
      { x: 1285, y: 215, label: 'Konsentrasi' },
      { x: 2005, y: 215, label: 'Semangat' },
    ],
    enemies: [],
    npcs: [
      {
        x: 210,
        y: 460,
        title: 'Malki — Hutan Cokelat',
        lines: [
          'Ayo Bobo Balls! Kumpulkan 10 Bola Cokelat dan 3 Simbol (Energi, Konsentrasi, Semangat).',
          'Hati-hati saat melompati sungai! Sentuh bendera checkpoint di tengah hutan untuk menyimpan titik aman.',
        ],
      },
      {
        x: 2480,
        y: 460,
        title: 'Gerbang Kuis Manfaat Sarapan',
        lines: [
          'Kamu hampir sampai di Lembah Gizi! Tekan tombol Aksi di depan gerbang hijau untuk menjawab kuis pentingnya sarapan!',
        ],
      },
    ],
  },

  2: {
    id: 2,
    worldWidth: 3000,
    skyTop: 0xfde047,
    skyBottom: 0xd9f99d,
    hillColorBack: 0x84cc16,
    hillColorFront: 0x15803d,
    tileKey: 'tile_orchard',
    collectibleKey: 'item_fruit',
    spawn: { x: 100, y: 390 },
    checkpoint: { x: 1470, y: 460 },
    gate: { x: 2840, y: 460 },
    miniGameStation: { x: 2560, y: 460, label: 'Meja Susun Sarapan' },
    platforms: [
      { x: 0, y: 460, w: 620, h: 80, kind: 'ground' },
      { x: 320, y: 375, w: 160, h: 28, kind: 'ledge' },
      // Gap 620..920 covered by horizontal moving platform
      { x: 920, y: 460, w: 680, h: 80, kind: 'ground' },
      { x: 1030, y: 370, w: 160, h: 28, kind: 'ledge' },
      { x: 1250, y: 290, w: 170, h: 28, kind: 'ledge' },
      // Gap 1600..1920 with vertical lift + ledge
      { x: 1920, y: 460, w: 420, h: 80, kind: 'ground' },
      { x: 2050, y: 370, w: 160, h: 28, kind: 'ledge' },
      // Gap 2340..2460
      { x: 2460, y: 460, w: 540, h: 80, kind: 'ground' },
    ],
    movingPlatforms: [
      { x: 730, y: 410, w: 130, h: 24, axis: 'x', range: 95, speed: 95 },
      { x: 1750, y: 390, w: 130, h: 24, axis: 'y', range: 75, speed: 75 },
    ],
    waterZones: [
      { x: 620, w: 300 },
      { x: 1600, w: 320 },
      { x: 2340, w: 120 },
    ],
    collectibles: [
      { x: 360, y: 335 },
      { x: 430, y: 335 },
      { x: 750, y: 350 },
      { x: 1080, y: 330 },
      { x: 1330, y: 250 },
      { x: 1750, y: 270 },
      { x: 2110, y: 330 },
      { x: 2390, y: 360 },
    ],
    symbols: [
      { x: 400, y: 285, label: 'Karbohidrat' },
      { x: 1335, y: 205, label: 'Protein' },
      { x: 1750, y: 215, label: 'Sayuran' },
      { x: 2130, y: 275, label: 'Buah' },
    ],
    enemies: [
      { x: 480, y: 430, minX: 330, maxX: 580, speed: 80, kind: 'candy' },
      { x: 1180, y: 430, minX: 980, maxX: 1380, speed: 95, kind: 'candy' },
      { x: 2120, y: 430, minX: 1960, maxX: 2290, speed: 100, kind: 'candy' },
    ],
    npcs: [
      {
        x: 200,
        y: 460,
        title: 'Malki — Lembah Gizi',
        lines: [
          'Waspada Monster Permen! Lompati kepalanya atau hindari agar nyawa tidak berkurang.',
          'Kumpulkan 4 simbol gizi (Karbohidrat, Protein, Sayuran, Buah), lalu susun menu sarapan di meja sebelum gerbang!',
        ],
      },
    ],
  },

  3: {
    id: 3,
    worldWidth: 3100,
    skyTop: 0xfdba74,
    skyBottom: 0xfef3c7,
    hillColorBack: 0xf59e0b,
    hillColorFront: 0xc2410c,
    tileKey: 'tile_factory',
    collectibleKey: 'item_energen',
    spawn: { x: 100, y: 390 },
    checkpoint: { x: 1520, y: 460 },
    gate: { x: 2940, y: 460 },
    miniGameStation: { x: 2660, y: 460, label: 'Pos Label & Menu' },
    platforms: [
      { x: 0, y: 460, w: 500, h: 80, kind: 'ground' },
      // Conveyor section 1 (pushes right)
      { x: 500, y: 455, w: 320, h: 26, kind: 'conveyor', conveyorSpeed: 105 },
      { x: 820, y: 460, w: 500, h: 80, kind: 'ground' },
      { x: 930, y: 370, w: 160, h: 28, kind: 'ledge' },
      { x: 1120, y: 290, w: 160, h: 28, kind: 'ledge' },
      // Gap 1320..1440
      { x: 1440, y: 460, w: 460, h: 80, kind: 'ground' },
      // Conveyor section 2 (pushes left -> challenge jump!)
      { x: 1960, y: 390, w: 280, h: 26, kind: 'conveyor', conveyorSpeed: -95 },
      { x: 2300, y: 460, w: 800, h: 80, kind: 'ground' },
      { x: 2420, y: 370, w: 170, h: 28, kind: 'ledge' },
    ],
    movingPlatforms: [
      { x: 1760, y: 390, w: 130, h: 24, axis: 'x', range: 70, speed: 85 },
    ],
    waterZones: [
      { x: 1320, w: 120 },
      { x: 1900, w: 400 },
    ],
    collectibles: [
      { x: 640, y: 405 },
      { x: 1190, y: 240 },
      { x: 1620, y: 410 },
      { x: 2090, y: 335 },
      { x: 2500, y: 320 },
    ],
    symbols: [
      { x: 1000, y: 320, label: 'Label Gizi' },
      { x: 2505, y: 260, label: 'Sarapan Praktis' },
    ],
    enemies: [
      { x: 1050, y: 430, minX: 860, maxX: 1270, speed: 100, kind: 'bot' },
      { x: 1700, y: 430, minX: 1560, maxX: 1850, speed: 95, kind: 'bot' },
      { x: 2520, y: 430, minX: 2340, maxX: 2600, speed: 95, kind: 'bot' },
    ],
    npcs: [
      {
        x: 210,
        y: 460,
        title: 'Malki — Pabrik Energen',
        lines: [
          'Perhatikan arah panah ban berjalan (conveyor belt) dan hindari robot pengemas!',
          'Kumpulkan 5 Kemasan Energen, lalu pelajari cara membaca label pangan di Pos Label sebelum gerbang!',
        ],
      },
    ],
  },

  4: {
    id: 4,
    worldWidth: 1650,
    skyTop: 0x3b0764,
    skyBottom: 0x6d28d9,
    hillColorBack: 0x4c1d95,
    hillColorFront: 0x2e1065,
    tileKey: 'tile_castle',
    collectibleKey: 'item_crystal',
    spawn: { x: 90, y: 390 },
    checkpoint: { x: 560, y: 460 },
    gate: { x: 1530, y: 460 },
    hasBoss: true,
    platforms: [
      { x: 0, y: 460, w: 1650, h: 80, kind: 'ground' },
      { x: 260, y: 370, w: 140, h: 28, kind: 'ledge' },
      // Boss Arena tactical ledges
      { x: 760, y: 370, w: 160, h: 28, kind: 'ledge' },
      { x: 980, y: 295, w: 180, h: 28, kind: 'ledge' },
      { x: 1210, y: 370, w: 150, h: 28, kind: 'ledge' },
    ],
    movingPlatforms: [],
    waterZones: [],
    collectibles: [
      { x: 305, y: 325 },
      { x: 360, y: 325 },
      { x: 830, y: 325 },
      { x: 1070, y: 250 },
      { x: 1280, y: 325 },
      { x: 900, y: 415 },
    ],
    symbols: [],
    enemies: [],
    npcs: [
      {
        x: 180,
        y: 460,
        title: 'Malki — Kastil Rasa Lapar',
        lines: [
          'Di arena depan ada ENERGEN JAHAT! Dia menyerang dengan Rasa Lapar, Tubuh Lemas, dan Kabut Sulit Konsentrasi.',
          'Lompat ke platform untuk menghindari serangannya, lalu sentuh Kristal Tantangan ungu dan jawab kuis gizi untuk mengalahkannya!',
        ],
      },
    ],
  },
};
