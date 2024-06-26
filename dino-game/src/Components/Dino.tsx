import React from 'react';
import styled from 'styled-components';
import { FaRunning } from "react-icons/fa";

const DinoWrapper = styled.div<{ isJumping: boolean }>`
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: ${({ isJumping }) => (isJumping ? '200px' : '70px')};
  transition: bottom 0.8s;
`;

const Dino: React.FC<{ isJumping: boolean }> = ({ isJumping }) => {
    return (
        <DinoWrapper isJumping={isJumping}>
            <FaRunning size={50} />
        </DinoWrapper>
    );
};

export default Dino;
