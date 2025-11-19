import { WarriorClass, WarriorAbility } from "./warriors";

export interface Player {
  id: number;
  x: number;
  y: number;
  hasOrb: boolean;
  isDead: boolean;
  color: string;
  glowColor: string;
  health: number;
  maxHealth: number;
  warrior: WarriorClass;
  velocityX: number;
  velocityY: number;
  cooldowns: { [abilityId: string]: number };
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
  type: "rock" | "wall" | "pillar" | "tree";
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  ownerId: number;
  ability: WarriorAbility;
  distanceTraveled: number;
}

export interface DamageNumber {
  id: string;
  x: number;
  y: number;
  damage: number;
  opacity: number;
  offsetY: number;
}

export interface ParticleEffect {
  id: string;
  x: number;
  y: number;
  type: 'hit' | 'ability' | 'death';
  color: string;
  opacity: number;
  scale: number;
}

export const PLAYER_SIZE = 30;
export const PILLAR_SIZE = 40;
export const COLLISION_DISTANCE = 35;
export const DEPOSIT_DISTANCE = 50;
export const MAP_WIDTH = 2400;
export const MAP_HEIGHT = 2400;
export const PROJECTILE_SIZE = 12;

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
  const radius = 800;

  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI * 2) / 12;
    pillars.push({
      id: i,
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      isTarget: false,
    });
  }

  return pillars;
}

export function createPlayers(playerWarrior: WarriorClass): Player[] {
  const players: Player[] = [];
  const centerX = MAP_WIDTH / 2;
  const centerY = MAP_HEIGHT / 2;
  const radius = 150;

  const { WARRIORS } = require('./warriors');

  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI * 2) / 10;
    const warrior = i === 0 ? playerWarrior : WARRIORS[i % WARRIORS.length];
    
    players.push({
      id: i,
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      hasOrb: i === 0,
      isDead: false,
      color: warrior.color,
      glowColor: warrior.glowColor,
      health: warrior.stats.maxHealth,
      maxHealth: warrior.stats.maxHealth,
      warrior: warrior,
      velocityX: 0,
      velocityY: 0,
      cooldowns: {},
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
  let pillarId = Math.floor(Math.random() * 12);
  while (pillarId === excludeId) {
    pillarId = Math.floor(Math.random() * 12);
  }
  return pillarId;
}

export function createObstacles(): Obstacle[] {
  const obstacles: Obstacle[] = [];
  const centerX = MAP_WIDTH / 2;
  const centerY = MAP_HEIGHT / 2;

  const obstacleConfigs = [
    { x: centerX + 400, y: centerY, width: 80, height: 20, type: "wall" as const },
    { x: centerX - 400, y: centerY, width: 80, height: 20, type: "wall" as const },
    { x: centerX, y: centerY + 400, width: 20, height: 80, type: "wall" as const },
    { x: centerX, y: centerY - 400, width: 20, height: 80, type: "wall" as const },
    
    { x: centerX + 300, y: centerY + 300, width: 60, height: 60, type: "rock" as const },
    { x: centerX - 300, y: centerY + 300, width: 60, height: 60, type: "rock" as const },
    { x: centerX + 300, y: centerY - 300, width: 60, height: 60, type: "rock" as const },
    { x: centerX - 300, y: centerY - 300, width: 60, height: 60, type: "rock" as const },
    
    { x: centerX + 600, y: centerY + 200, width: 45, height: 45, type: "tree" as const },
    { x: centerX - 600, y: centerY + 200, width: 45, height: 45, type: "tree" as const },
    { x: centerX + 600, y: centerY - 200, width: 45, height: 45, type: "tree" as const },
    { x: centerX - 600, y: centerY - 200, width: 45, height: 45, type: "tree" as const },
    
    { x: centerX + 200, y: centerY + 600, width: 45, height: 45, type: "tree" as const },
    { x: centerX - 200, y: centerY + 600, width: 45, height: 45, type: "tree" as const },
    { x: centerX + 200, y: centerY - 600, width: 45, height: 45, type: "tree" as const },
    { x: centerX - 200, y: centerY - 600, width: 45, height: 45, type: "tree" as const },
    
    { x: centerX + 900, y: centerY, width: 100, height: 25, type: "wall" as const },
    { x: centerX - 900, y: centerY, width: 100, height: 25, type: "wall" as const },
    { x: centerX, y: centerY + 900, width: 25, height: 100, type: "wall" as const },
    { x: centerX, y: centerY - 900, width: 25, height: 100, type: "wall" as const },
    
    { x: centerX + 500, y: centerY + 500, width: 50, height: 50, type: "pillar" as const },
    { x: centerX - 500, y: centerY + 500, width: 50, height: 50, type: "pillar" as const },
    { x: centerX + 500, y: centerY - 500, width: 50, height: 50, type: "pillar" as const },
    { x: centerX - 500, y: centerY - 500, width: 50, height: 50, type: "pillar" as const },
    
    { x: centerX + 800, y: centerY + 400, width: 70, height: 70, type: "rock" as const },
    { x: centerX - 800, y: centerY + 400, width: 70, height: 70, type: "rock" as const },
    { x: centerX + 800, y: centerY - 400, width: 70, height: 70, type: "rock" as const },
    { x: centerX - 800, y: centerY - 400, width: 70, height: 70, type: "rock" as const },
    
    { x: centerX + 400, y: centerY + 800, width: 70, height: 70, type: "rock" as const },
    { x: centerX - 400, y: centerY + 800, width: 70, height: 70, type: "rock" as const },
    { x: centerX + 400, y: centerY - 800, width: 70, height: 70, type: "rock" as const },
    { x: centerX - 400, y: centerY - 800, width: 70, height: 70, type: "rock" as const },
  ];

  obstacleConfigs.forEach((config, index) => {
    obstacles.push({
      id: index,
      ...config,
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

export function checkProjectileObstacleCollision(
  projectile: Projectile,
  obstacles: Obstacle[]
): boolean {
  return checkObstacleCollision(projectile.x, projectile.y, PROJECTILE_SIZE, obstacles);
}

export function updateCooldowns(cooldowns: { [key: string]: number }, deltaTime: number): { [key: string]: number } {
  const updated: { [key: string]: number } = {};
  Object.keys(cooldowns).forEach(key => {
    const newValue = Math.max(0, cooldowns[key] - deltaTime);
    if (newValue > 0) {
      updated[key] = newValue;
    }
  });
  return updated;
}

export function canUseAbility(player: Player, ability: WarriorAbility): boolean {
  return !player.cooldowns[ability.id] || player.cooldowns[ability.id] <= 0;
}

export function createProjectile(
  player: Player,
  ability: WarriorAbility,
  targetX: number,
  targetY: number
): Projectile | null {
  if (ability.type === 'melee' || ability.type === 'aoe') {
    return null;
  }

  const dx = targetX - player.x;
  const dy = targetY - player.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance === 0) return null;

  const velocityX = (dx / distance) * ability.speed;
  const velocityY = (dy / distance) * ability.speed;

  return {
    id: `proj-${player.id}-${Date.now()}-${Math.random()}`,
    x: player.x,
    y: player.y,
    velocityX,
    velocityY,
    ownerId: player.id,
    ability,
    distanceTraveled: 0,
  };
}

export function updateProjectiles(
  projectiles: Projectile[],
  obstacles: Obstacle[]
): Projectile[] {
  return projectiles.filter(proj => {
    proj.x += proj.velocityX;
    proj.y += proj.velocityY;
    proj.distanceTraveled += Math.sqrt(proj.velocityX ** 2 + proj.velocityY ** 2);

    if (proj.distanceTraveled > proj.ability.range) return false;
    
    if (checkProjectileObstacleCollision(proj, obstacles)) return false;
    
    if (proj.x < 0 || proj.x > MAP_WIDTH || proj.y < 0 || proj.y > MAP_HEIGHT) return false;

    return true;
  });
}

export function checkProjectileHit(
  projectile: Projectile,
  players: Player[]
): { hit: boolean; targetId?: number } {
  for (const player of players) {
    if (player.id === projectile.ownerId || player.isDead) continue;

    if (checkCollision(projectile.x, projectile.y, player.x, player.y, COLLISION_DISTANCE)) {
      return { hit: true, targetId: player.id };
    }
  }

  return { hit: false };
}
