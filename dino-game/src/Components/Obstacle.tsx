import React from 'react';
import styled from 'styled-components';
import { RiRectangleFill } from "react-icons/ri";

const ObstacleWrapper = styled.div<{ left: number }>`
  width: 40px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 50px;
  left: ${({ left }) => left}px;
  transition: left 0.07s linear;
  color: orange;
`;

const Obstacle: React.FC<{ left: number }> = ({ left }) => {
    return (
        <ObstacleWrapper left={left}>
            <RiRectangleFill size={50} />
        </ObstacleWrapper>
    );
};

export default Obstacle;
