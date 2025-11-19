export interface WarriorAbility {
  id: string;
  name: string;
  description: string;
  damage: number;
  cooldown: number;
  range: number;
  speed: number;
  type: 'projectile' | 'melee' | 'aoe';
  color: string;
}

export interface WarriorClass {
  id: string;
  name: string;
  description: string;
  type: 'melee' | 'ranged' | 'tank';
  color: string;
  glowColor: string;
  stats: {
    maxHealth: number;
    moveSpeed: number;
    defense: number;
  };
  abilities: [WarriorAbility, WarriorAbility, WarriorAbility];
}

export const WARRIORS: WarriorClass[] = [
  {
    id: 'shadow_striker',
    name: 'Shadow Striker',
    description: 'Swift melee assassin with devastating close-range attacks',
    type: 'melee',
    color: '#8B00FF',
    glowColor: '#D800FF',
    stats: {
      maxHealth: 120,
      moveSpeed: 4.5,
      defense: 0.8,
    },
    abilities: [
      {
        id: 'shadow_slash',
        name: 'Shadow Slash',
        description: 'Quick melee strike',
        damage: 25,
        cooldown: 0.8,
        range: 50,
        speed: 0,
        type: 'melee',
        color: '#8B00FF',
      },
      {
        id: 'dark_dash',
        name: 'Dark Dash',
        description: 'Dash forward dealing damage',
        damage: 35,
        cooldown: 3,
        range: 120,
        speed: 15,
        type: 'melee',
        color: '#D800FF',
      },
      {
        id: 'phantom_strike',
        name: 'Phantom Strike',
        description: 'Powerful AoE slash',
        damage: 50,
        cooldown: 6,
        range: 70,
        speed: 0,
        type: 'aoe',
        color: '#FF00FF',
      },
    ],
  },
  {
    id: 'arcane_archer',
    name: 'Arcane Archer',
    description: 'Long-range specialist with devastating projectile attacks',
    type: 'ranged',
    color: '#00D9FF',
    glowColor: '#00FFFF',
    stats: {
      maxHealth: 100,
      moveSpeed: 3.5,
      defense: 0.7,
    },
    abilities: [
      {
        id: 'energy_arrow',
        name: 'Energy Arrow',
        description: 'Fast energy projectile',
        damage: 20,
        cooldown: 0.6,
        range: 400,
        speed: 12,
        type: 'projectile',
        color: '#00D9FF',
      },
      {
        id: 'piercing_shot',
        name: 'Piercing Shot',
        description: 'Powerful piercing arrow',
        damage: 40,
        cooldown: 2.5,
        range: 500,
        speed: 15,
        type: 'projectile',
        color: '#00FFFF',
      },
      {
        id: 'arcane_volley',
        name: 'Arcane Volley',
        description: 'Spread of 5 energy arrows',
        damage: 15,
        cooldown: 5,
        range: 350,
        speed: 10,
        type: 'projectile',
        color: '#4DFFFF',
      },
    ],
  },
  {
    id: 'iron_guardian',
    name: 'Iron Guardian',
    description: 'Heavily armored tank with defensive abilities and area control',
    type: 'tank',
    color: '#FFD700',
    glowColor: '#FFA500',
    stats: {
      maxHealth: 180,
      moveSpeed: 2.8,
      defense: 1.3,
    },
    abilities: [
      {
        id: 'shield_bash',
        name: 'Shield Bash',
        description: 'Melee attack with knockback',
        damage: 18,
        cooldown: 1,
        range: 55,
        speed: 0,
        type: 'melee',
        color: '#FFD700',
      },
      {
        id: 'ground_slam',
        name: 'Ground Slam',
        description: 'AoE slam around player',
        damage: 30,
        cooldown: 3.5,
        range: 100,
        speed: 0,
        type: 'aoe',
        color: '#FFA500',
      },
      {
        id: 'iron_wave',
        name: 'Iron Wave',
        description: 'Expanding wave projectile',
        damage: 45,
        cooldown: 7,
        range: 200,
        speed: 6,
        type: 'projectile',
        color: '#FF8C00',
      },
    ],
  },
  {
    id: 'plasma_mage',
    name: 'Plasma Mage',
    description: 'Energy wielder with explosive magical projectiles',
    type: 'ranged',
    color: '#FF006E',
    glowColor: '#FF4D9F',
    stats: {
      maxHealth: 90,
      moveSpeed: 3.2,
      defense: 0.6,
    },
    abilities: [
      {
        id: 'plasma_bolt',
        name: 'Plasma Bolt',
        description: 'Fast plasma projectile',
        damage: 22,
        cooldown: 0.7,
        range: 380,
        speed: 11,
        type: 'projectile',
        color: '#FF006E',
      },
      {
        id: 'energy_burst',
        name: 'Energy Burst',
        description: 'Explosive AoE blast',
        damage: 35,
        cooldown: 3,
        range: 90,
        speed: 0,
        type: 'aoe',
        color: '#FF4D9F',
      },
      {
        id: 'meteor_strike',
        name: 'Meteor Strike',
        description: 'Devastating slow projectile',
        damage: 60,
        cooldown: 8,
        range: 450,
        speed: 7,
        type: 'projectile',
        color: '#FF1493',
      },
    ],
  },
  {
    id: 'void_reaper',
    name: 'Void Reaper',
    description: 'Balanced warrior with deadly combo potential',
    type: 'melee',
    color: '#4361EE',
    glowColor: '#5E7FFF',
    stats: {
      maxHealth: 130,
      moveSpeed: 3.8,
      defense: 0.9,
    },
    abilities: [
      {
        id: 'void_blade',
        name: 'Void Blade',
        description: 'Swift sword strike',
        damage: 23,
        cooldown: 0.9,
        range: 52,
        speed: 0,
        type: 'melee',
        color: '#4361EE',
      },
      {
        id: 'void_rift',
        name: 'Void Rift',
        description: 'Short-range energy wave',
        damage: 32,
        cooldown: 2.8,
        range: 150,
        speed: 9,
        type: 'projectile',
        color: '#5E7FFF',
      },
      {
        id: 'reaper_spin',
        name: 'Reaper Spin',
        description: 'Spinning AoE attack',
        damage: 42,
        cooldown: 5.5,
        range: 80,
        speed: 0,
        type: 'aoe',
        color: '#7B9EFF',
      },
    ],
  },
  {
    id: 'storm_bringer',
    name: 'Storm Bringer',
    description: 'Elemental warrior commanding lightning and thunder',
    type: 'ranged',
    color: '#06FFA5',
    glowColor: '#00FF88',
    stats: {
      maxHealth: 110,
      moveSpeed: 3.6,
      defense: 0.75,
    },
    abilities: [
      {
        id: 'lightning_bolt',
        name: 'Lightning Bolt',
        description: 'Instant lightning strike',
        damage: 24,
        cooldown: 0.75,
        range: 420,
        speed: 18,
        type: 'projectile',
        color: '#06FFA5',
      },
      {
        id: 'thunder_clap',
        name: 'Thunder Clap',
        description: 'AoE stun and damage',
        damage: 28,
        cooldown: 3.2,
        range: 110,
        speed: 0,
        type: 'aoe',
        color: '#00FF88',
      },
      {
        id: 'storm_fury',
        name: 'Storm Fury',
        description: 'Chaining lightning projectile',
        damage: 55,
        cooldown: 6.5,
        range: 400,
        speed: 13,
        type: 'projectile',
        color: '#00FFB3',
      },
    ],
  },
];

export function getWarriorById(id: string): WarriorClass | undefined {
  return WARRIORS.find(w => w.id === id);
}

export function getDefaultWarrior(): WarriorClass {
  return WARRIORS[0];
}
