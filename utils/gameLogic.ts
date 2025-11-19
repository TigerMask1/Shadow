export interface Player {
  id: number;
  x: number;
  y: number;
  hasOrb: boolean;
  isDead: boolean;
  color: string;
  health: number;
  maxHealth: number;
}

export interface Pillar {
  id: number;
  x: number;
  y: number;
  isTarget: boolean;
}

export interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: "rock" | "wall";
}

export const PLAYER_SIZE = 30;
export const PILLAR_SIZE = 40;
export const COLLISION_DISTANCE = 35;
export const DEPOSIT_DISTANCE = 50;
export const MAP_WIDTH = 800;
export const MAP_HEIGHT = 800;

export const PLAYER_COLORS = [
  "#ff006e",
  "#06ffa5",
  "#4361ee",
  "#ffd60a",
  "#ff9e00",
  "#00d9ff",
  "#ff00ff",
  "#00ff00",
  "#ff3366",
  "#66ff33",
];

export function createPillars(): Pillar[] {
  const pillars: Pillar[] = [];
  const centerX = MAP_WIDTH / 2;
  const centerY = MAP_HEIGHT / 2;
  const radius = 300;

  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI * 2) / 8;
    pillars.push({
      id: i,
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      isTarget: false,
    });
  }

  return pillars;
}

export function createPlayers(): Player[] {
  const players: Player[] = [];
  const centerX = MAP_WIDTH / 2;
  const centerY = MAP_HEIGHT / 2;
  const radius = 100;

  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI * 2) / 10;
    players.push({
      id: i,
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      hasOrb: i === 0,
      isDead: false,
      color: PLAYER_COLORS[i],
      health: 100,
      maxHealth: 100,
    });
  }

  return players;
}

export function checkCollision(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  distance: number
): boolean {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy) < distance;
}

export function getRandomTargetPillar(excludeId?: number): number {
  let pillarId = Math.floor(Math.random() * 8);
  while (pillarId === excludeId) {
    pillarId = Math.floor(Math.random() * 8);
  }
  return pillarId;
}

export function createObstacles(): Obstacle[] {
  const obstacles: Obstacle[] = [];
  const centerX = MAP_WIDTH / 2;
  const centerY = MAP_HEIGHT / 2;

  const obstaclePositions = [
    { x: centerX + 200, y: centerY, width: 60, height: 15, type: "wall" as const },
    { x: centerX - 200, y: centerY, width: 60, height: 15, type: "wall" as const },
    { x: centerX, y: centerY + 200, width: 15, height: 60, type: "wall" as const },
    { x: centerX, y: centerY - 200, width: 15, height: 60, type: "wall" as const },
    { x: centerX + 150, y: centerY + 150, width: 40, height: 40, type: "rock" as const },
    { x: centerX - 150, y: centerY + 150, width: 40, height: 40, type: "rock" as const },
    { x: centerX + 150, y: centerY - 150, width: 40, height: 40, type: "rock" as const },
    { x: centerX - 150, y: centerY - 150, width: 40, height: 40, type: "rock" as const },
  ];

  obstaclePositions.forEach((pos, index) => {
    obstacles.push({
      id: index,
      ...pos,
    });
  });

  return obstacles;
}

export function checkObstacleCollision(
  x: number,
  y: number,
  size: number,
  obstacles: Obstacle[]
): boolean {
  for (const obstacle of obstacles) {
    const playerLeft = x - size / 2;
    const playerRight = x + size / 2;
    const playerTop = y - size / 2;
    const playerBottom = y + size / 2;

    const obsLeft = obstacle.x - obstacle.width / 2;
    const obsRight = obstacle.x + obstacle.width / 2;
    const obsTop = obstacle.y - obstacle.height / 2;
    const obsBottom = obstacle.y + obstacle.height / 2;

    if (
      playerRight > obsLeft &&
      playerLeft < obsRight &&
      playerBottom > obsTop &&
      playerTop < obsBottom
    ) {
      return true;
    }
  }
  return false;
}
