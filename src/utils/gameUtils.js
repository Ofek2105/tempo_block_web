import { GAME_CONFIG, ELEMENTS } from '../config/gameConfig';

export const checkShieldCollision = (bullet, shield, shieldAngle, shieldColor, orb) => {
    const dx = bullet.x - shield.x;
    const dy = bullet.y - shield.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    // console.log(shieldColor, bullet.colorName);
    if (distance <= shield.radius + bullet.radius && distance >= orb.radius && shieldColor === bullet.colorName) {
        // Check if bullet is within shield arc
        const bulletAngle = Math.atan2(dy, dx);
        let angleDiff = bulletAngle - shieldAngle;

        // Normalize angle difference
        while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
        while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

        return Math.abs(angleDiff) <= shield.arcSize / 2;
    }
    return false;
};

export const checkOrbCollision = (bullet, orb) => {
    const dx = bullet.x - orb.x;
    const dy = bullet.y - orb.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= orb.radius + bullet.radius;
};

export const createParticles = (x, y, color, count = GAME_CONFIG.PARTICLE_COUNT) => {
    const particles = [];
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            life: 30,
            maxLife: 30,
            color: color
        });
    }
    return particles;
};

export const spawnBullet = (orb, wave) => {
    const direction = GAME_CONFIG.DIRECTIONS[Math.floor(Math.random() * GAME_CONFIG.DIRECTIONS.length)];
    const speed = GAME_CONFIG.BULLET_SPEED + (wave - 1) * GAME_CONFIG.DIFFICULTY_INCREASE;

    // Spawn from outside the screen
    const spawnDistance = GAME_CONFIG.BULLET_SPAWN_RADIUS;
    const startX = orb.x - direction.x * spawnDistance;
    const startY = orb.y - direction.y * spawnDistance;

    const keys = Object.keys(ELEMENTS);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const element = ELEMENTS[randomKey];

    return {
        x: startX,
        y: startY,
        vx: direction.x * speed,
        vy: direction.y * speed,
        radius: GAME_CONFIG.BULLET_RADIUS,
        trail: [],
        colorName: element.name,
        colorValue: element.bulletColor,
        trailColorValue: element.bulletTrailColor,
    };
};