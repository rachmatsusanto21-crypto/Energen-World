import Phaser from 'phaser';

function makeCanvas(scene: Phaser.Scene, key: string, w: number, h: number): CanvasRenderingContext2D | null {
  if (scene.textures.exists(key)) return null;
  const tex = scene.textures.createCanvas(key, w, h);
  if (!tex) return null;
  return tex.getContext();
}

function finishCanvas(scene: Phaser.Scene, key: string): void {
  const tex = scene.textures.get(key) as Phaser.Textures.CanvasTexture;
  tex.refresh();
}

function drawShoe(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  mainColor: string,
  angle = 0
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = mainColor;
  ctx.strokeStyle = '#1E110A';
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.ellipse(0, 0, 10, 6.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // White sole & toe cap
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(3, 1.5, 6.5, 3.6, 0, 0, Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-8, 3);
  ctx.lineTo(8, 3);
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2.4;
  ctx.stroke();
  ctx.restore();
}

function drawGlove(ctx: CanvasRenderingContext2D, x: number, y: number, r = 7.5): void {
  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#1E110A';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Little thumb bump
  ctx.beginPath();
  ctx.arc(x - r * 0.45, y - r * 0.45, r * 0.42, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawBoboFrame(
  scene: Phaser.Scene,
  key: string,
  pose: 'idle0' | 'idle1' | 'walk0' | 'walk1' | 'walk2' | 'walk3' | 'jump' | 'hurt' | 'win'
): void {
  const ctx = makeCanvas(scene, key, 80, 86);
  if (!ctx) return;

  const bobY =
    pose === 'idle1' ? 1.5 : pose === 'walk1' || pose === 'walk3' ? -3 : pose === 'jump' || pose === 'win' ? -4 : 0;
  const scaleY = pose === 'jump' ? 1.07 : pose === 'idle1' ? 0.98 : 1;
  const scaleX = pose === 'jump' ? 0.94 : pose === 'idle1' ? 1.02 : 1;

  ctx.save();
  ctx.translate(40, 48 + bobY);
  ctx.scale(scaleX, scaleY);

  // Legs & Shoes
  let leftShoeX = -9;
  let leftShoeY = 23;
  let leftShoeRot = 0;
  let rightShoeX = 11;
  let rightShoeY = 23;
  let rightShoeRot = 0;

  if (pose === 'walk0') {
    leftShoeX = -13;
    leftShoeY = 21;
    leftShoeRot = -0.3;
    rightShoeX = 14;
    rightShoeY = 24;
    rightShoeRot = 0.2;
  } else if (pose === 'walk1') {
    leftShoeX = -5;
    leftShoeY = 24;
    rightShoeX = 7;
    rightShoeY = 20;
    rightShoeRot = -0.25;
  } else if (pose === 'walk2') {
    leftShoeX = 12;
    leftShoeY = 22;
    leftShoeRot = 0.25;
    rightShoeX = -12;
    rightShoeY = 24;
    rightShoeRot = -0.2;
  } else if (pose === 'walk3') {
    leftShoeX = 6;
    leftShoeY = 20;
    rightShoeX = -6;
    rightShoeY = 24;
  } else if (pose === 'jump') {
    leftShoeX = -11;
    leftShoeY = 25;
    leftShoeRot = 0.35;
    rightShoeX = 11;
    rightShoeY = 25;
    rightShoeRot = 0.35;
  }

  // Little brown legs
  ctx.strokeStyle = '#1E110A';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-7, 15);
  ctx.lineTo(leftShoeX, leftShoeY - 3);
  ctx.moveTo(7, 15);
  ctx.lineTo(rightShoeX, rightShoeY - 3);
  ctx.stroke();

  drawShoe(ctx, leftShoeX, leftShoeY, '#DC2626', leftShoeRot);
  drawShoe(ctx, rightShoeX, rightShoeY, '#DC2626', rightShoeRot);

  // Back arm
  let backHandX = 24;
  let backHandY = 4;
  let frontHandX = -24;
  let frontHandY = 5;

  if (pose === 'walk0') {
    frontHandX = -25;
    frontHandY = -2;
    backHandX = 23;
    backHandY = 10;
  } else if (pose === 'walk2') {
    frontHandX = -21;
    frontHandY = 11;
    backHandX = 25;
    backHandY = -2;
  } else if (pose === 'jump' || pose === 'win') {
    frontHandX = -25;
    frontHandY = -14;
    backHandX = 25;
    backHandY = -14;
  } else if (pose === 'hurt') {
    frontHandX = -26;
    frontHandY = -4;
    backHandX = 26;
    backHandY = -4;
  }

  ctx.strokeStyle = '#1E110A';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(16, 2);
  ctx.lineTo(backHandX, backHandY);
  ctx.stroke();
  drawGlove(ctx, backHandX, backHandY, 7);

  // Round chocolate body
  const grad = ctx.createRadialGradient(-7, -10, 4, 0, 0, 25);
  grad.addColorStop(0, '#9A542D');
  grad.addColorStop(0.55, '#6F3618');
  grad.addColorStop(1, '#47200B');

  ctx.fillStyle = grad;
  ctx.strokeStyle = '#1E110A';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Subtle cocoa spots
  ctx.fillStyle = 'rgba(42, 17, 5, 0.35)';
  ctx.beginPath();
  ctx.arc(-13, 8, 2.3, 0, Math.PI * 2);
  ctx.arc(14, 11, 1.8, 0, Math.PI * 2);
  ctx.arc(-15, -5, 1.6, 0, Math.PI * 2);
  ctx.fill();

  // Red backwards baseball cap with yellow B
  ctx.save();
  ctx.fillStyle = '#EF4444';
  ctx.strokeStyle = '#1E110A';
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.arc(0, -8, 20, Math.PI * 1.04, Math.PI * 1.96);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // Cap brim facing left (backwards cap look)
  ctx.beginPath();
  ctx.ellipse(-18, -10, 10, 3.8, -0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Yellow 'B' badge on cap
  ctx.fillStyle = '#FACC15';
  ctx.font = 'bold 11px Fredoka, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('B', 7, -17);
  ctx.restore();

  // Face (facing right slightly)
  if (pose === 'hurt') {
    // X eyes
    ctx.strokeStyle = '#1E110A';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(-7, -5);
    ctx.lineTo(-1, 1);
    ctx.moveTo(-1, -5);
    ctx.lineTo(-7, 1);
    ctx.moveTo(6, -5);
    ctx.lineTo(12, 1);
    ctx.moveTo(12, -5);
    ctx.lineTo(6, 1);
    ctx.stroke();
    // Wavy sad mouth
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.ellipse(3, 9, 6, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (pose === 'win') {
    // Happy curved ^ ^ eyes
    ctx.strokeStyle = '#1E110A';
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.arc(-4, -2, 4.5, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(9, -2, 4.5, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
    // Big cheerful open mouth
    ctx.fillStyle = '#7F1D1D';
    ctx.beginPath();
    ctx.arc(3, 5, 7, 0, Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#FB7185';
    ctx.beginPath();
    ctx.ellipse(3, 9, 4, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Big adorable eyes
    const drawEye = (ex: number, ey: number, ew: number, eh: number) => {
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#1E110A';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(ex, ey, ew, eh, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#241108';
      ctx.beginPath();
      ctx.ellipse(ex + 1, ey + 0.5, ew * 0.58, eh * 0.65, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(ex - 0.8, ey - 1.8, 1.8, 0, Math.PI * 2);
      ctx.fill();
    };
    drawEye(-3, -2, 5.2, 6.8);
    drawEye(10, -2, 4.8, 6.5);

    // Smile
    ctx.fillStyle = '#7F1D1D';
    ctx.strokeStyle = '#1E110A';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(4, 6, 5.8, 0, Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#FB7185';
    ctx.beginPath();
    ctx.ellipse(4, 9.5, 3.2, 2, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Front arm
  ctx.strokeStyle = '#1E110A';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-16, 2);
  ctx.lineTo(frontHandX, frontHandY);
  ctx.stroke();
  drawGlove(ctx, frontHandX, frontHandY, 7.2);

  ctx.restore();
  finishCanvas(scene, key);
}

function drawMalkiFrame(scene: Phaser.Scene, key: string, pose: 'idle0' | 'idle1' | 'cheer'): void {
  const ctx = makeCanvas(scene, key, 84, 90);
  if (!ctx) return;

  const bobY = pose === 'idle1' ? 2 : pose === 'cheer' ? -5 : 0;
  ctx.save();
  ctx.translate(42, 50 + bobY);

  // Shoes
  drawShoe(ctx, -10, 25, '#F59E0B', 0);
  drawShoe(ctx, 10, 25, '#F59E0B', 0);

  // Arms
  const handY = pose === 'cheer' ? -15 : 4;
  ctx.strokeStyle = '#1E110A';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-20, 4);
  ctx.lineTo(-28, handY);
  ctx.moveTo(20, 4);
  ctx.lineTo(28, handY);
  ctx.stroke();
  drawGlove(ctx, -28, handY, 7);
  drawGlove(ctx, 28, handY, 7);

  // Golden cracker square body with scalloped edges
  const grad = ctx.createLinearGradient(-20, -22, 20, 22);
  grad.addColorStop(0, '#FCD34D');
  grad.addColorStop(0.5, '#F59E0B');
  grad.addColorStop(1, '#D97706');

  ctx.fillStyle = grad;
  ctx.strokeStyle = '#1E110A';
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.roundRect(-21, -21, 42, 42, 8);
  ctx.fill();
  ctx.stroke();

  // Biscuit dimples
  ctx.fillStyle = '#B45309';
  const dimples = [
    [-14, -14],
    [14, -14],
    [-14, 14],
    [14, 14],
    [-15, 0],
    [15, 0],
  ];
  dimples.forEach(([dx, dy]) => {
    ctx.beginPath();
    ctx.arc(dx, dy, 1.8, 0, Math.PI * 2);
    ctx.fill();
  });

  // Yellow/white Malkist cap
  ctx.fillStyle = '#FACC15';
  ctx.strokeStyle = '#1E110A';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.arc(0, -17, 17, Math.PI, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.rect(-9, -31, 18, 10);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#1E110A';
  ctx.font = 'bold 7px Plus Jakarta Sans, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Malki', 0, -23.5);

  // Cap visor
  ctx.fillStyle = '#FACC15';
  ctx.beginPath();
  ctx.ellipse(10, -17, 13, 3.5, 0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Eyes & smile
  if (pose === 'cheer') {
    ctx.strokeStyle = '#1E110A';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.arc(-7, -3, 4.5, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(7, -3, 4.5, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
  } else {
    [-7, 7].forEach((ex) => {
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#1E110A';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(ex, -3, 4.8, 6.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#1E110A';
      ctx.beginPath();
      ctx.ellipse(ex, -2.5, 2.7, 3.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(ex - 1, -4.5, 1.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  ctx.fillStyle = '#7F1D1D';
  ctx.strokeStyle = '#1E110A';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 6, 5.8, 0, Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();
  finishCanvas(scene, key);
}

function drawBossFrame(scene: Phaser.Scene, key: string, pose: 'idle0' | 'idle1' | 'attack' | 'hurt'): void {
  const ctx = makeCanvas(scene, key, 140, 150);
  if (!ctx) return;

  const bob = pose === 'idle1' ? 3 : pose === 'attack' ? -5 : 0;
  ctx.save();
  ctx.translate(70, 82 + bob);

  // Heavy dark boots
  drawShoe(ctx, -20, 48, '#581C87', 0);
  drawShoe(ctx, 20, 48, '#581C87', 0);

  // Arms + clenched white fists
  const fistY = pose === 'attack' ? -18 : 6;
  const fistX = pose === 'attack' ? 50 : 44;
  ctx.strokeStyle = '#1E110A';
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.moveTo(-30, 6);
  ctx.lineTo(-fistX, fistY);
  ctx.moveTo(30, 6);
  ctx.lineTo(fistX, fistY);
  ctx.stroke();
  drawGlove(ctx, -fistX, fistY, 13);
  drawGlove(ctx, fistX, fistY, 13);

  // Angry red Energen box/can body
  const grad = ctx.createLinearGradient(-34, -44, 34, 42);
  grad.addColorStop(0, pose === 'hurt' ? '#FCA5A5' : '#EF4444');
  grad.addColorStop(0.55, '#DC2626');
  grad.addColorStop(1, '#7F1D1D');

  ctx.fillStyle = grad;
  ctx.strokeStyle = '#1E110A';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(-34, -46, 68, 86, 12);
  ctx.fill();
  ctx.stroke();

  // Yellow angry header strip
  ctx.fillStyle = '#FACC15';
  ctx.beginPath();
  ctx.roundRect(-30, -42, 60, 18, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#991B1B';
  ctx.font = 'bold 10px Fredoka, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('JAHAT', 0, -30);

  // Angry eyes + furrowed brows
  [-12, 12].forEach((ex, idx) => {
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#1E110A';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.ellipse(ex, -6, 9, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#991B1B';
    ctx.beginPath();
    ctx.arc(ex, -5, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Angry eyebrow
    ctx.strokeStyle = '#1E110A';
    ctx.lineWidth = 4;
    ctx.beginPath();
    if (idx === 0) {
      ctx.moveTo(ex - 10, -18);
      ctx.lineTo(ex + 7, -12);
    } else {
      ctx.moveTo(ex - 7, -12);
      ctx.lineTo(ex + 10, -18);
    }
    ctx.stroke();
  });

  // Jagged angry mouth
  ctx.fillStyle = '#450A0A';
  ctx.strokeStyle = '#1E110A';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(-18, 12, 36, 15, 6);
  ctx.fill();
  ctx.stroke();

  // Sharp teeth
  ctx.fillStyle = '#FFFFFF';
  for (let tx = -12; tx <= 12; tx += 8) {
    ctx.beginPath();
    ctx.moveTo(tx - 3, 12);
    ctx.lineTo(tx, 18);
    ctx.lineTo(tx + 3, 12);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
  finishCanvas(scene, key);
}

function drawCandyMonster(scene: Phaser.Scene, key: string, step: number): void {
  const ctx = makeCanvas(scene, key, 56, 56);
  if (!ctx) return;
  ctx.save();
  ctx.translate(28, 30 + (step === 1 ? -2 : 0));

  // Candy wrapper tails
  ctx.fillStyle = '#EC4899';
  ctx.strokeStyle = '#1E110A';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-14, -4);
  ctx.lineTo(-25, -12);
  ctx.lineTo(-23, 8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(14, -4);
  ctx.lineTo(25, -12);
  ctx.lineTo(23, 8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Feet
  ctx.fillStyle = '#701A75';
  ctx.beginPath();
  ctx.ellipse(step === 0 ? -8 : -5, 20, 6, 4, 0, 0, Math.PI * 2);
  ctx.ellipse(step === 0 ? 8 : 5, 20, 6, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Round candy body
  ctx.fillStyle = '#A855F7';
  ctx.beginPath();
  ctx.arc(0, 0, 17, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Spiral stripe
  ctx.strokeStyle = '#F9A8D4';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0.3, Math.PI * 1.4);
  ctx.stroke();

  // Grumpy eyes
  [-6, 6].forEach((ex, i) => {
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(ex, -3, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1E110A';
    ctx.beginPath();
    ctx.arc(ex, -3, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1E110A';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(ex - 4, i === 0 ? -8 : -6);
    ctx.lineTo(ex + 4, i === 0 ? -6 : -8);
    ctx.stroke();
  });

  ctx.restore();
  finishCanvas(scene, key);
}

function drawSparkBot(scene: Phaser.Scene, key: string, step: number): void {
  const ctx = makeCanvas(scene, key, 54, 54);
  if (!ctx) return;
  ctx.save();
  ctx.translate(27, 29 + (step === 1 ? -2 : 0));

  // Wheels
  ctx.fillStyle = '#334155';
  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(-9, 17, 6, 0, Math.PI * 2);
  ctx.arc(9, 17, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Metal hazard crate body
  ctx.fillStyle = '#F97316';
  ctx.beginPath();
  ctx.roundRect(-16, -15, 32, 30, 6);
  ctx.fill();
  ctx.stroke();

  // Caution visor
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.roundRect(-12, -8, 24, 11, 4);
  ctx.fill();

  ctx.fillStyle = step === 0 ? '#EF4444' : '#FACC15';
  ctx.beginPath();
  ctx.arc(-5, -2.5, 3, 0, Math.PI * 2);
  ctx.arc(5, -2.5, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
  finishCanvas(scene, key);
}

function drawCollectiblesAndTiles(scene: Phaser.Scene): void {
  // 1. Bola Cokelat collectible
  {
    const ctx = makeCanvas(scene, 'item_cocoa', 36, 36);
    if (ctx) {
      const grad = ctx.createRadialGradient(13, 12, 3, 18, 18, 14);
      grad.addColorStop(0, '#B4693E');
      grad.addColorStop(0.6, '#6F3618');
      grad.addColorStop(1, '#3D1908');
      ctx.fillStyle = grad;
      ctx.strokeStyle = '#1E110A';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(18, 18, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.beginPath();
      ctx.arc(13, 13, 3, 0, Math.PI * 2);
      ctx.fill();
      finishCanvas(scene, 'item_cocoa');
    }
  }

  // 2. Fresh Apple / Fruit collectible (Level 2)
  {
    const ctx = makeCanvas(scene, 'item_fruit', 36, 36);
    if (ctx) {
      ctx.fillStyle = '#EF4444';
      ctx.strokeStyle = '#1E110A';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(18, 20, 11.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#22C55E';
      ctx.beginPath();
      ctx.ellipse(22, 8, 6, 3.5, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.beginPath();
      ctx.arc(14, 16, 2.8, 0, Math.PI * 2);
      ctx.fill();
      finishCanvas(scene, 'item_fruit');
    }
  }

  // 3. Energen Pack collectible (Level 3)
  {
    const ctx = makeCanvas(scene, 'item_energen', 38, 42);
    if (ctx) {
      ctx.fillStyle = '#FACC15';
      ctx.strokeStyle = '#1E110A';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(7, 5, 24, 32, 5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#DC2626';
      ctx.fillRect(9, 10, 20, 8);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 7px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ENG', 19, 16.5);
      ctx.fillStyle = '#EA580C';
      ctx.beginPath();
      ctx.arc(19, 27, 6, 0, Math.PI * 2);
      ctx.fill();
      finishCanvas(scene, 'item_energen');
    }
  }

  // 4. Energy Crystal (Level 4)
  {
    const ctx = makeCanvas(scene, 'item_crystal', 38, 42);
    if (ctx) {
      ctx.fillStyle = '#38BDF8';
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(19, 4);
      ctx.lineTo(31, 18);
      ctx.lineTo(19, 38);
      ctx.lineTo(7, 18);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#E0F2FE';
      ctx.beginPath();
      ctx.moveTo(19, 8);
      ctx.lineTo(25, 18);
      ctx.lineTo(19, 28);
      ctx.closePath();
      ctx.fill();
      finishCanvas(scene, 'item_crystal');
    }
  }

  // 5. Golden Symbol Medallion
  {
    const ctx = makeCanvas(scene, 'item_symbol', 44, 44);
    if (ctx) {
      ctx.fillStyle = '#FDE047';
      ctx.strokeStyle = '#92400E';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(22, 22, 17, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(22, 22, 12, 0, Math.PI * 2);
      ctx.fill();

      // Star in middle
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI / 5) * i - Math.PI / 2;
        const r = i % 2 === 0 ? 8 : 3.6;
        const px = 22 + Math.cos(angle) * r;
        const py = 22 + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      finishCanvas(scene, 'item_symbol');
    }
  }

  // 6. Boss Challenge Beacon
  {
    const ctx = makeCanvas(scene, 'boss_beacon', 52, 62);
    if (ctx) {
      ctx.fillStyle = '#A855F7';
      ctx.strokeStyle = '#1E1B4B';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(26, 4);
      ctx.lineTo(44, 26);
      ctx.lineTo(26, 52);
      ctx.lineTo(8, 26);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FDE047';
      ctx.font = 'bold 20px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('?', 26, 28);
      finishCanvas(scene, 'boss_beacon');
    }
  }

  // 7. Projectiles
  {
    const drawProj = (key: string, bg: string, fg: string, glyph: string) => {
      const ctx = makeCanvas(scene, key, 34, 34);
      if (!ctx) return;
      ctx.fillStyle = bg;
      ctx.strokeStyle = '#1E110A';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(17, 17, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = fg;
      ctx.font = 'bold 14px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(glyph, 17, 17);
      finishCanvas(scene, key);
    };
    drawProj('proj_hunger', '#EF4444', '#FEF08A', '!');
    drawProj('proj_weak', '#6366F1', '#FFFFFF', 'Z');
    drawProj('proj_fog', '#7E22CE', '#F5D0FE', '~');
  }

  // 8. Platform tiles (grass, orchard, factory, castle, bridge, conveyor)
  const drawPlatformTile = (key: string, topColor: string, bodyColor: string, accent: string) => {
    const ctx = makeCanvas(scene, key, 64, 64);
    if (!ctx) return;
    ctx.fillStyle = bodyColor;
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(14, 34, 4, 0, Math.PI * 2);
    ctx.arc(46, 48, 5, 0, Math.PI * 2);
    ctx.arc(28, 52, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = topColor;
    ctx.fillRect(0, 0, 64, 15);
    ctx.fillStyle = 'rgba(0,0,0,0.16)';
    ctx.fillRect(0, 15, 64, 4);
    ctx.strokeStyle = 'rgba(0,0,0,0.22)';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, 62, 62);
    finishCanvas(scene, key);
  };

  drawPlatformTile('tile_grass', '#4ADE80', '#854D0E', '#713F12');
  drawPlatformTile('tile_orchard', '#84CC16', '#9A3412', '#7C2D12');
  drawPlatformTile('tile_factory', '#FB923C', '#475569', '#334155');
  drawPlatformTile('tile_castle', '#A855F7', '#312E81', '#1E1B4B');

  // Bridge plank
  {
    const ctx = makeCanvas(scene, 'tile_bridge', 64, 24);
    if (ctx) {
      ctx.fillStyle = '#B45309';
      ctx.strokeStyle = '#451A03';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(1, 1, 62, 22, 5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#92400E';
      ctx.fillRect(20, 2, 3, 20);
      ctx.fillRect(42, 2, 3, 20);
      finishCanvas(scene, 'tile_bridge');
    }
  }

  // Conveyor belt frames
  [0, 1, 2].forEach((idx) => {
    const key = `tile_conveyor_${idx}`;
    const ctx = makeCanvas(scene, key, 64, 26);
    if (!ctx) return;
    ctx.fillStyle = '#1E293B';
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(1, 1, 62, 24, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FACC15';
    const offset = idx * 10;
    for (let x = -10 + offset; x < 64; x += 22) {
      ctx.beginPath();
      ctx.moveTo(x, 6);
      ctx.lineTo(x + 8, 13);
      ctx.lineTo(x, 20);
      ctx.lineTo(x + 5, 20);
      ctx.lineTo(x + 13, 13);
      ctx.lineTo(x + 5, 6);
      ctx.closePath();
      ctx.fill();
    }
    finishCanvas(scene, key);
  });

  // Water surface strip
  {
    const ctx = makeCanvas(scene, 'tile_water', 64, 40);
    if (ctx) {
      ctx.fillStyle = '#0EA5E9';
      ctx.fillRect(0, 8, 64, 32);
      ctx.fillStyle = '#7DD3FC';
      ctx.beginPath();
      ctx.arc(16, 10, 12, Math.PI, Math.PI * 2);
      ctx.arc(48, 10, 12, Math.PI, Math.PI * 2);
      ctx.fill();
      finishCanvas(scene, 'tile_water');
    }
  }

  // Checkpoint Flags
  const drawFlag = (key: string, up: boolean) => {
    const ctx = makeCanvas(scene, key, 48, 76);
    if (!ctx) return;
    ctx.fillStyle = '#E2E8F0';
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 2.5;
    ctx.fillRect(10, 8, 6, 64);
    ctx.strokeRect(10, 8, 6, 64);
    ctx.fillStyle = '#FACC15';
    ctx.beginPath();
    ctx.arc(13, 8, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = up ? '#22C55E' : '#EF4444';
    const fy = up ? 14 : 42;
    ctx.beginPath();
    ctx.moveTo(16, fy);
    ctx.lineTo(44, fy + 10);
    ctx.lineTo(16, fy + 22);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    finishCanvas(scene, key);
  };
  drawFlag('flag_down', false);
  drawFlag('flag_up', true);

  // Exit Gate
  const drawGate = (key: string, open: boolean) => {
    const ctx = makeCanvas(scene, key, 86, 110);
    if (!ctx) return;
    ctx.fillStyle = open ? '#22C55E' : '#94A3B8';
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.roundRect(6, 10, 74, 96, [36, 36, 6, 6]);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = open ? '#DCFCE7' : '#334155';
    ctx.beginPath();
    ctx.roundRect(16, 22, 54, 82, [26, 26, 2, 2]);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = open ? '#15803D' : '#FACC15';
    ctx.font = 'bold 13px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(open ? 'BUKA!' : 'KUIS', 43, 66);
    finishCanvas(scene, key);
  };
  drawGate('gate_closed', false);
  drawGate('gate_open', true);

  // Scenic Tree
  {
    const ctx = makeCanvas(scene, 'prop_tree', 110, 140);
    if (ctx) {
      ctx.fillStyle = '#78350F';
      ctx.strokeStyle = '#1E110A';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(43, 72, 24, 64, 5);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#22C55E';
      ctx.beginPath();
      ctx.arc(55, 50, 34, 0, Math.PI * 2);
      ctx.arc(32, 62, 24, 0, Math.PI * 2);
      ctx.arc(78, 62, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      finishCanvas(scene, 'prop_tree');
    }
  }

  // Cloud
  {
    const ctx = makeCanvas(scene, 'prop_cloud', 130, 64);
    if (ctx) {
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      ctx.beginPath();
      ctx.arc(40, 38, 18, 0, Math.PI * 2);
      ctx.arc(65, 28, 24, 0, Math.PI * 2);
      ctx.arc(92, 38, 18, 0, Math.PI * 2);
      ctx.fill();
      finishCanvas(scene, 'prop_cloud');
    }
  }

  // Particle spark
  {
    const ctx = makeCanvas(scene, 'fx_star', 16, 16);
    if (ctx) {
      ctx.fillStyle = '#FACC15';
      ctx.beginPath();
      ctx.arc(8, 8, 6, 0, Math.PI * 2);
      ctx.fill();
      finishCanvas(scene, 'fx_star');
    }
  }
}

export function createGameTextures(scene: Phaser.Scene): void {
  drawBoboFrame(scene, 'bobo_idle_0', 'idle0');
  drawBoboFrame(scene, 'bobo_idle_1', 'idle1');
  drawBoboFrame(scene, 'bobo_walk_0', 'walk0');
  drawBoboFrame(scene, 'bobo_walk_1', 'walk1');
  drawBoboFrame(scene, 'bobo_walk_2', 'walk2');
  drawBoboFrame(scene, 'bobo_walk_3', 'walk3');
  drawBoboFrame(scene, 'bobo_jump', 'jump');
  drawBoboFrame(scene, 'bobo_hurt', 'hurt');
  drawBoboFrame(scene, 'bobo_win', 'win');

  drawMalkiFrame(scene, 'malki_idle_0', 'idle0');
  drawMalkiFrame(scene, 'malki_idle_1', 'idle1');
  drawMalkiFrame(scene, 'malki_cheer', 'cheer');

  drawBossFrame(scene, 'boss_idle_0', 'idle0');
  drawBossFrame(scene, 'boss_idle_1', 'idle1');
  drawBossFrame(scene, 'boss_attack', 'attack');
  drawBossFrame(scene, 'boss_hurt', 'hurt');

  drawCandyMonster(scene, 'candy_0', 0);
  drawCandyMonster(scene, 'candy_1', 1);
  drawSparkBot(scene, 'bot_0', 0);
  drawSparkBot(scene, 'bot_1', 1);

  drawCollectiblesAndTiles(scene);

  if (!scene.anims.exists('bobo_idle')) {
    scene.anims.create({
      key: 'bobo_idle',
      frames: [{ key: 'bobo_idle_0' }, { key: 'bobo_idle_1' }],
      frameRate: 3,
      repeat: -1,
    });
  }
  if (!scene.anims.exists('bobo_walk')) {
    scene.anims.create({
      key: 'bobo_walk',
      frames: [
        { key: 'bobo_walk_0' },
        { key: 'bobo_walk_1' },
        { key: 'bobo_walk_2' },
        { key: 'bobo_walk_3' },
      ],
      frameRate: 10,
      repeat: -1,
    });
  }
  if (!scene.anims.exists('malki_idle')) {
    scene.anims.create({
      key: 'malki_idle',
      frames: [{ key: 'malki_idle_0' }, { key: 'malki_idle_1' }],
      frameRate: 3,
      repeat: -1,
    });
  }
  if (!scene.anims.exists('candy_walk')) {
    scene.anims.create({
      key: 'candy_walk',
      frames: [{ key: 'candy_0' }, { key: 'candy_1' }],
      frameRate: 5,
      repeat: -1,
    });
  }
  if (!scene.anims.exists('bot_walk')) {
    scene.anims.create({
      key: 'bot_walk',
      frames: [{ key: 'bot_0' }, { key: 'bot_1' }],
      frameRate: 6,
      repeat: -1,
    });
  }
  if (!scene.anims.exists('boss_idle')) {
    scene.anims.create({
      key: 'boss_idle',
      frames: [{ key: 'boss_idle_0' }, { key: 'boss_idle_1' }],
      frameRate: 3,
      repeat: -1,
    });
  }
}
