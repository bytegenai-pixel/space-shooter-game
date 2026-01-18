/**
 * Core game logic - pure functions that can be tested without Phaser
 */

// Enemy spawn counts per wave
export function calculateEnemyCount(level, wave) {
    const baseCount = 8 + (level * 4) + (wave * 4);
    if (level === 2) return baseCount + 4;
    if (level === 3) return baseCount + 6;
    return baseCount;
}

// Spawn delay between enemies (ms)
export function calculateSpawnDelay(level, wave) {
    let delay = Math.max(250, 800 - (level * 80) - (wave * 40));
    if (level === 3) delay = Math.max(180, delay - 50);
    return delay;
}

// Enemy type probabilities
export function getEnemyProbabilities(level, wave) {
    const bigChance = Math.min(0.08 + (level * 0.06) + (wave * 0.03), 0.30);
    const mediumChance = Math.min(0.25 + (level * 0.08) + (wave * 0.04), 0.50);
    return { bigChance, mediumChance, smallChance: 1 - bigChance - mediumChance };
}

// Boss HP calculation
export function calculateBossHP(level) {
    const hpMap = { 1: 50, 2: 75, 3: 100 };
    return hpMap[level] || 50;
}

// Big enemy health
export function calculateBigEnemyHealth(level) {
    return 3 + level;
}

// Damage amounts
export const DAMAGE = {
    ENEMY_COLLISION: 50,
    BOSS_COLLISION: 30,
    BULLET_HIT: 20
};

// Powerup drop rate and weights
export const POWERUP = {
    DROP_RATE: 0.20,
    WEIGHTS: {
        weapon: 0.30,
        shield: 0.25,
        speed: 0.20,
        life: 0.05,
        fireball: 0.20
    }
};

// Score values
export const SCORE = {
    SMALL_ENEMY: 100,
    MEDIUM_ENEMY: 200,
    BIG_ENEMY: 500,
    BOSS: 2000
};

// Waves per level
export function getWavesPerLevel(level) {
    return level === 1 ? 2 : 3;
}

// Validate level number
export function isValidLevel(level) {
    return level >= 1 && level <= 3;
}

// Calculate health bar width (0-196 pixels)
export function calculateHealthBarWidth(health, maxHealth) {
    return Math.max(0, (health / maxHealth) * 196);
}
