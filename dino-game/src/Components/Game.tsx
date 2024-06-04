import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Dino from './Dino';
import Obstacle from './Obstacle';

const GameWrapper = styled.div`
  width: 100%;
  height: 300px;
  background: linear-gradient(to bottom, #87ceeb, #fff);
  overflow: hidden;
  position: relative;
  border: 1px solid #000;
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
`;

const Game: React.FC = () => {
    const [isJumping, setIsJumping] = useState(false);
    const [obstacles, setObstacles] = useState<number[]>([]);
    const [score, setScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(true);

    const handleStart = () => {
        setScore(0);
        setObstacles([]);
        setIsGameOver(false);
    };

    useEffect(() => {
        const handleJump = (e: KeyboardEvent) => {
            if (e.code === 'Space' && !isJumping && !isGameOver) {
                setIsJumping(true);
                setTimeout(() => setIsJumping(false), 300);
            }
        };
        window.addEventListener('keydown', handleJump);
        return () => window.removeEventListener('keydown', handleJump);
    }, [isJumping, isGameOver]);

    useEffect(() => {
        if (!isGameOver) {
            const interval = setInterval(() => {
                setObstacles((prev) => {
                    const newObstacles = prev
                        .filter((obstacle) => obstacle > -20)
                        .map((obstacle) => {
                            if (obstacle < 70 && obstacle > 40 && !isJumping) {
                                setIsGameOver(true);
                                return 1000;
                            }
                            return obstacle - 5;
                        });
                    if (Math.random() < 0.1) {
                        newObstacles.push(1000);
                    }
                    return newObstacles;
                });
                setScore((prev) => prev + 1);
            }, 50);
            return () => clearInterval(interval);
        }
    }, [isJumping, isGameOver]);

    return (
        <GameWrapper>
            <Dino isJumping={isJumping} />
            {obstacles.map((left, index) => (
                <Obstacle key={index} left={left} />
            ))}
            <Score>Score: {score}</Score>
            {isGameOver && <StartButton onClick={handleStart}>Start</StartButton>}
        </GameWrapper>
    );
};

export default Game;