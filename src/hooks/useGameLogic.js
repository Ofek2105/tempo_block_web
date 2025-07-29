import { useState, useEffect, useCallback, useRef } from 'react';
import { GAME_CONFIG } from '../config/gameConfig';
import { checkShieldCollision, checkOrbCollision, createParticles, spawnBullet } from '../utils/gameUtils';
import { soundManager } from '../utils/soundManager';


export const useGameLogic = () => {
    const [gameState, setGameState] = useState({
        lives: GAME_CONFIG.INITIAL_LIVES,
        score: 0,
        wave: 1,
        gameOver: false,
        paused: false,
        frameCount: 0
    });

    const [orb] = useState({
        x: GAME_CONFIG.CANVAS_WIDTH / 2,
        y: GAME_CONFIG.CANVAS_HEIGHT / 2,
        radius: GAME_CONFIG.ORB_RADIUS
    });

    const shieldRef = useRef({
        x: GAME_CONFIG.CANVAS_WIDTH / 2,
        y: GAME_CONFIG.CANVAS_HEIGHT / 2,
        radius: GAME_CONFIG.SHIELD_RADIUS,
        arcSize: GAME_CONFIG.SHIELD_ARC_DEGREES * Math.PI / 180
    });

    const selectedElementRef = useRef(GAME_CONFIG.DEFAULT_ELEMENT);


    const [bullets, setBullets] = useState([]);
    const [particles, setParticles] = useState([]);
    const [cameraShake, setCameraShake] = useState({ x: 0, y: 0, intensity: 0, duration: 0 });

    // Use refs for timing to prevent frame-rate dependency
    const nextWaveTimerRef = useRef(0);
    const bulletsSpawnedThisWaveRef = useRef(0);
    const spawnTimerRef = useRef(0);
    const shieldAngleRef = useRef(0);
    const lastTimeRef = useRef(0);
    const bulletsRef = useRef([]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key.toUpperCase();
            const newElement = {
                Q: 'fire',
                W: 'water',
                E: 'earth',
                R: 'air'
            }[key];

            if (newElement) {
                console.log(`Element changed to ${newElement}`);
                selectedElementRef.current = newElement;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const updateShieldAngle = useCallback((mouseX, mouseY) => {
        const dx = mouseX - shieldRef.current.x;
        const dy = mouseY - shieldRef.current.y;
        shieldAngleRef.current = Math.atan2(dy, dx);
    }, [shieldRef.current.x, shieldRef.current.y]);

    const addShake = useCallback((intensity = GAME_CONFIG.SHAKE_INTENSITY) => {
        setCameraShake({
            intensity,
            duration: GAME_CONFIG.SHAKE_DURATION,
            x: 0,
            y: 0
        });
    }, []);

    const restartGame = useCallback(() => {
        setGameState({
            lives: GAME_CONFIG.INITIAL_LIVES,
            score: 0,
            wave: 1,
            gameOver: false,
            paused: false,
            frameCount: 0
        });

        setBullets([]);
        setParticles([]);
        setCameraShake({ x: 0, y: 0, intensity: 0, duration: 0 });
        nextWaveTimerRef.current = 0;
        bulletsSpawnedThisWaveRef.current = 0;
        spawnTimerRef.current = 0;
        lastTimeRef.current = 0;
    }, []);

    const update = useCallback((currentTime, deltaTime) => {
        if (gameState.gameOver || gameState.paused) return;

        const dt = deltaTime / 1000; // Convert to seconds
        // console.log(`Game update at time: ${currentTime}, dt: ${dt}`);
        setGameState(prev => ({ ...prev, frameCount: prev.frameCount + 1 }));

        // Wave management with delta time
        if (nextWaveTimerRef.current > 0) {
            nextWaveTimerRef.current -= dt;
        } else if (bulletsSpawnedThisWaveRef.current < GAME_CONFIG.BULLETS_PER_WAVE) {
            if (spawnTimerRef.current <= 0) {
                setBullets(prev => [...prev, spawnBullet(orb, gameState.wave)]);
                bulletsSpawnedThisWaveRef.current++;
                spawnTimerRef.current = GAME_CONFIG.WAVE_SPAWN_DELAY; // Reset spawn timer
            } else {
                spawnTimerRef.current -= dt;
            }
        }

        // Update bullets with delta time
        setBullets(prevBullets => {
            const updatedBullets = [];
            let scoreIncrease = 0;
            let livesDecrease = 0;
            let newParticles = [];

            prevBullets.forEach(bullet => {
                // Add to trail
                bullet.trail.push({ x: bullet.x, y: bullet.y });
                if (bullet.trail.length > 8) bullet.trail.shift();

                // Move bullet using delta time
                bullet.x += bullet.vx * dt;
                bullet.y += bullet.vy * dt;

                // Check collisions
                if (checkShieldCollision(bullet, shieldRef.current, shieldAngleRef.current, selectedElementRef.current, orb)) { // deflect bullet
                    soundManager.playRandomDeflect();
                    newParticles.push(...createParticles(bullet.x, bullet.y, GAME_CONFIG.SHIELD_COLOR));
                    scoreIncrease += 10;
                } else if (checkOrbCollision(bullet, orb)) { // hit orb
                    soundManager.playRandomHit();
                    newParticles.push(...createParticles(bullet.x, bullet.y, GAME_CONFIG.BULLET_COLOR, 8));
                    livesDecrease++;
                    addShake();
                } else {
                    updatedBullets.push(bullet);
                }
            });

            // Update game state
            if (scoreIncrease > 0 || livesDecrease > 0) {
                console.log(`Score increase: ${scoreIncrease}, Lives decrease: ${livesDecrease}`);
                setGameState(prev => {
                    const newLives = prev.lives - livesDecrease;
                    return {
                        ...prev,
                        score: prev.score + scoreIncrease,
                        lives: newLives,
                        gameOver: newLives <= 0
                    };
                });
            }

            // Add new particles
            if (newParticles.length > 0) {
                setParticles(prev => [...prev, ...newParticles]);
            }

            return updatedBullets;
        });

        // Check if wave is complete
        if (nextWaveTimerRef.current <= 0 &&
            bulletsSpawnedThisWaveRef.current >= GAME_CONFIG.BULLETS_PER_WAVE &&
            bullets.length === 0) {
            setGameState(prev => ({ ...prev, wave: prev.wave + 1 }));
            bulletsSpawnedThisWaveRef.current = 0;
            nextWaveTimerRef.current = GAME_CONFIG.WAVE_INTERVAL;
        }

        // Update particles with delta time
        setParticles(prev =>
            prev.map(particle => ({
                ...particle,
                x: particle.x + particle.vx * dt * 60, // Scale for smooth movement
                y: particle.y + particle.vy * dt * 60,
                vx: particle.vx * 0.98,
                vy: particle.vy * 0.98,
                life: particle.life - 1
            })).filter(particle => particle.life > 0)
        );

        // Update camera shake with delta time
        setCameraShake(prev => {
            if (prev.duration > 0) {
                return {
                    x: (Math.random() - 0.5) * prev.intensity,
                    y: (Math.random() - 0.5) * prev.intensity,
                    intensity: prev.intensity * Math.pow(0.9, dt * 60),
                    duration: prev.duration - 1
                };
            }
            return { x: 0, y: 0, intensity: 0, duration: 0 };
        });
    }, [gameState.gameOver, gameState.paused, gameState.wave, shieldRef.current, orb, bullets.length, addShake]);

    return {
        gameState,
        orb,
        shield: shieldRef,
        bullets,
        particles,
        cameraShake,
        updateShieldAngle,
        shieldAngleRef,
        selectedElementRef,
        restartGame,
        update,
        lastTimeRef
    };
};