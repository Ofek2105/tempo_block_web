
export const GAME_CONFIG = {

    // Canvas dimensions
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,

    // Frame rate control
    TARGET_FPS: 60,
    FRAME_TIME: 1000 / 60, // 16.67ms per frame

    // Orb settings
    ORB_RADIUS: 25,
    ORB_COLOR: '#4a9eff',
    ORB_GLOW_COLOR: 'rgba(74, 158, 255, 0.6)',

    // Shield settings
    SHIELD_RADIUS: 45,
    SHIELD_ARC_DEGREES: 45,
    SHIELD_COLOR: '#00ff88',
    SHIELD_GLOW_COLOR: 'rgba(0, 255, 136, 0.4)',
    SHIELD_WIDTH: 8,
    DEFAULT_ELEMENT: 'fire', // Default element for the shield

    // Bullet settings
    BULLET_SPAWN_RADIUS: 400,
    BULLET_RADIUS: 10,
    BULLET_SPEED: 120, // pixels per second (instead of per frame)
    BULLET_COLOR: '#ff4444',
    BULLET_TRAIL_COLOR: 'rgba(255, 68, 68, 0.3)',

    // Game settings
    INITIAL_LIVES: 300,
    BULLETS_PER_WAVE: 10,
    WAVE_SPAWN_DELAY: 1, // seconds between bullet spawns
    WAVE_INTERVAL: 5, // seconds between waves
    DIFFICULTY_INCREASE: 6, // speed increase per wave (pixels per second)

    // Visual effects
    PARTICLE_COUNT: 5,
    SHAKE_INTENSITY: 8,
    SHAKE_DURATION: 10,

    // Directions for bullet spawning
    DIRECTIONS: [
        { x: 1, y: 0 },   // right
        { x: -1, y: 0 },  // left
        { x: 0, y: 1 },   // down
        { x: 0, y: -1 },  // up
        { x: 1, y: 1 },   // down-right
        { x: -1, y: 1 },  // down-left
        { x: 1, y: -1 },  // up-right
        { x: -1, y: -1 }  // up-left
    ]
};


export const ELEMENTS = {

    fire: {
        name: 'fire',
        key: 'Q',
        shieldColor: '#ff4a4a',
        shieldGlowColor: 'rgba(255, 74, 74, 0.4)',
        bulletColor: '#ff1a1a',
        bulletTrailColor: 'rgba(255, 26, 26, 0.3)'
    },
    water: {
        name: 'water',
        key: 'W',
        shieldColor: '#4a9eff',
        shieldGlowColor: 'rgba(74, 158, 255, 0.4)',
        bulletColor: '#1a7fff',
        bulletTrailColor: 'rgba(26, 127, 255, 0.3)'
    },
    earth: {
        name: 'earth',
        key: 'E',
        shieldColor: '#a0522d',
        shieldGlowColor: 'rgba(160, 82, 45, 0.4)',
        bulletColor: '#8b4513',
        bulletTrailColor: 'rgba(139, 69, 19, 0.3)'
    },
    air: {
        name: 'air',
        key: 'R',
        shieldColor: '#ffffff',
        shieldGlowColor: 'rgba(255, 255, 255, 0.3)',
        bulletColor: '#cccccc',
        bulletTrailColor: 'rgba(200, 200, 200, 0.3)'
    }
};
