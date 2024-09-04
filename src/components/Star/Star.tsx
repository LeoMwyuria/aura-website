import React from 'react';

interface StarProps {
  size: number;
  delay: number;
  image: string;
}

const Star: React.FC<StarProps> = ({ size, delay, image }) => {
  return (
    <div
      className="star"
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${image})`,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        animation: `starAnimation 2s ${delay}s forwards`,
      }}
    />
  );
};

export default Star;
