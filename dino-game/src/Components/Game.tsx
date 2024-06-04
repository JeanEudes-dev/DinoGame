import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Dino from './Dino';
import Obstacle from './Obstacle';

const GameWrapper = styled.div`
  width: 100%;
  height: 50vh;
  background: linear-gradient(to bottom, #87ceeb, #fff);
  overflow: hidden;
  position: relative;
  font-family: 'Arial', sans-serif;
`;

const Score = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  font-weight: bold;
`;

const StartButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 10px 20px;
  font-size: 20px;
  cursor: pointer;
  border: 1px solid blue;
  border-radius: 10px
`;

const GameOverMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 80pt;
  color: red;
  font-weight: bold;
`;

const JumpButton = styled.button`
  position: absolute;
  bottom: 1px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  font-size: 20px;
  cursor: pointer; 
  border: 1px solid green;
  border-radius: 10px
`;

interface ObstacleState {
    id: number;
    left: number;
}

const Game: React.FC = () => {
    const [isJumping, setIsJumping] = useState(false);
    const [obstacles, setObstacles] = useState<ObstacleState[]>([]);
    const [score, setScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(true);
    const [nextObstacleId, setNextObstacleId] = useState(1);
    const [viewMessage, setViewMessage] = useState(false);
    const [speed, setSpeed] = useState(5);
    const [jumpDuration, setJumpDuration] = useState(1000);

    const handleStart = () => {
        setScore(0);
        setObstacles([]);
        setIsGameOver(false);
        setNextObstacleId(1);
        setSpeed(5);
        setJumpDuration(1000);
    };

    const handleJump = () => {
        if (!isJumping && !isGameOver) {
            setIsJumping(true);
            setTimeout(() => setIsJumping(false), jumpDuration);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                handleJump();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isJumping, isGameOver, jumpDuration]);

    useEffect(() => {
        if (!isGameOver) {
            const interval = setInterval(() => {
                setObstacles((prev) => {
                    const newObstacles = prev
                        .map((obstacle) => ({ ...obstacle, left: obstacle.left - speed }))
                        .filter((obstacle) => obstacle.left > -50);

                    const spawnProbability = Math.min(0.05 + score / 2000, 0.3);
                    const minDistance = 350;
                    const canSpawnNewObstacle = newObstacles.length === 0 || (newObstacles[newObstacles.length - 1].left < (1000 - minDistance));

                    if (Math.random() < spawnProbability && canSpawnNewObstacle) {
                        newObstacles.push({ id: nextObstacleId, left: 1000 });
                        setNextObstacleId((prevId) => prevId + 1);
                    }

                    return newObstacles;
                });

                // Collision detection
                obstacles.forEach((obstacle) => {
                    if (obstacle.left < 50 && obstacle.left > 20 && !isJumping) {
                        setIsGameOver(true);
                        setViewMessage(true);
                        setTimeout(() => {
                            setViewMessage(false);
                        }, 3000);
                    }
                });

                setScore((prev) => prev + 1);

                // Increase speed and decrease jump duration every 1000 points
                if (score > 0 && score % 100 === 0) {
                    setSpeed((prev) => prev + 1);
                    setJumpDuration((prev) => Math.max(prev - 100, 200));
                }
            }, 50);

            return () => clearInterval(interval);
        }
    }, [isJumping, isGameOver, score, nextObstacleId, obstacles, speed, jumpDuration]);

    return (
        <GameWrapper>
            <Dino isJumping={isJumping} />
            {obstacles.map((obstacle) => (
                <Obstacle key={obstacle.id} left={obstacle.left} />
            ))}
            <Score>Score: {score}</Score>
            {isGameOver && (
                <>
                    {!viewMessage && (
                        <StartButton onClick={handleStart}>Start</StartButton>
                    )}
                    {viewMessage && (
                        <GameOverMessage>GAME OVER</GameOverMessage>
                    )}
                </>
            )}
            {!isGameOver && (
                <JumpButton onClick={handleJump}>Jump</JumpButton>
            )}
        </GameWrapper>
    );
};

export default Game;