import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { PlayScene } from '../game/PlayScene';
import { LevelId } from '../game/types';

interface GameCanvasProps {
  levelId: LevelId;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ levelId }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let destroyed = false;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: el,
      width: 960,
      height: 540,
      backgroundColor: '#1E110A',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scene: [],
      callbacks: {
        postBoot: (bootedGame) => {
          if (!destroyed) {
            bootedGame.scene.add('PlayScene', PlayScene, true, { levelId });
          }
        },
      },
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    return () => {
      destroyed = true;
      game.destroy(true);
      gameRef.current = null;
    };
  }, [levelId]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center bg-[#1E110A]"
    />
  );
};
