import React, { useRef, useEffect, useState } from 'react';
import { useGameLogic } from '../../hooks/useGameLogic';
import { GAME_CONFIG, ELEMENTS } from '../../config/gameConfig';
import './GameCanvas.css';
import GameOver from '../GameOver/GameOver';

const GameCanvas = () => {
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);
  const lastTimeRef = useRef(0);
  const [showGameOver, setShowGameOver] = useState(false);
  
    const {
        gameState,
        orb,
        shield,
        bullets,
        particles,
        cameraShake,
        updateShieldAngle,
        shieldAngleRef,
        selectedElementRef,
        restartGame,
        update,
    } = useGameLogic();

    useEffect(() => {
        console.log(gameState.gameOver);
        if (gameState.gameOver) {
            console.log(gameState.gameOver);
            setShowGameOver(true);
        }
    }, [gameState.gameOver]);


  // Mouse tracking
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleMouseMove = (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        updateShieldAngle(mouseX, mouseY);
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        return () => canvas.removeEventListener('mousemove', handleMouseMove);
    }, [updateShieldAngle]);

  // Render function
    const render = (ctx) => {
        // Clear canvas
        ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
        ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
        
        ctx.save();
        ctx.translate(cameraShake.x, cameraShake.y);
        
        // Draw bullet trails
        bullets.forEach(bullet => {
        if (bullet.trail.length > 1) {
            ctx.strokeStyle = bullet.trailColorValue;
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(bullet.trail[0].x, bullet.trail[0].y);
            for (let i = 1; i < bullet.trail.length; i++) {
            ctx.lineTo(bullet.trail[i].x, bullet.trail[i].y);
            }
            ctx.stroke();
        }
        });
        
        // Draw bullets
        bullets.forEach(bullet => {
        ctx.fillStyle = bullet.colorValue;
        ctx.shadowColor = bullet.colorValue;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        });
        
        // Draw orb with pulsing effect
        const pulse = Math.sin(gameState.frameCount * 0.1) * 0.2 + 1;
        ctx.fillStyle = GAME_CONFIG.ORB_COLOR;
        ctx.shadowColor = GAME_CONFIG.ORB_GLOW_COLOR;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Draw shield
        const element = ELEMENTS[selectedElementRef.current];

        ctx.strokeStyle = element.shieldColor;
        ctx.shadowColor = element.shieldGlowColor;
        ctx.shadowBlur = 15;
        ctx.lineWidth = GAME_CONFIG.SHIELD_WIDTH;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(shield.current.x, shield.current.y, shield.current.radius, 
            shieldAngleRef.current - shield.current.arcSize / 2, 
            shieldAngleRef.current + shield.current.arcSize / 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // Draw particles
        particles.forEach(particle => {
        const alpha = particle.life / particle.maxLife;
        ctx.fillStyle = particle.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        ctx.fill();
        });
        
        ctx.restore();
    };

  // Game loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = GAME_CONFIG.CANVAS_WIDTH;
        canvas.height = GAME_CONFIG.CANVAS_HEIGHT;

        let lag = 0;

        const gameLoop = (currentTime) => {
            if (lastTimeRef.current === 0) {
                lastTimeRef.current = currentTime;
            }

            const deltaTime = currentTime - lastTimeRef.current;
            lastTimeRef.current = currentTime;
            lag += deltaTime;

            // Fixed timestep updates
            while (lag >= GAME_CONFIG.FRAME_TIME) {
                update(currentTime, GAME_CONFIG.FRAME_TIME);
                lag -= GAME_CONFIG.FRAME_TIME;
            }

            // Always render
            render(ctx);
            animationIdRef.current = requestAnimationFrame(gameLoop);
        };

        animationIdRef.current = requestAnimationFrame(gameLoop);

        return () => {
        if (animationIdRef.current) {
            cancelAnimationFrame(animationIdRef.current);
        }
        };
    }, [update, bullets, particles, gameState.frameCount, cameraShake, shield, orb]);

    return (
        <>
            <div className="game-ui">
                <div className="ui-item">Lives: <span className="ui-value">{gameState.lives}</span></div>
                <div className="ui-item">Score: <span className="ui-value">{gameState.score}</span></div>
                <div className="ui-item">Wave: <span className="ui-value">{gameState.wave}</span></div>
            </div>
        
            <canvas 
            ref={canvasRef}
            className="game-canvas"
            />

            {showGameOver && (
                <GameOver
                score={gameState.score}
                wave={gameState.wave}
                onRestart={() => {
                    setShowGameOver(false);
                    restartGame();
                }}
            />
            )}
        </>
    );
};

export default GameCanvas;