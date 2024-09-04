import React, { useEffect } from 'react';
import starImage from '/src/assets/Star 7.png';
import Star from '../Star/Star';

const StarAnimation: React.FC = () => {
  useEffect(() => {
    const container = document.querySelector('.star-container');
    const body = document.body;
    
    if (container) {
      body.style.overflow = 'hidden'; 
      container.classList.add('transition-white');

      const fadeTimeout = setTimeout(() => {
        container.classList.add('done');
        body.style.overflow = ''; 
      }, 1700); 

      return () => {
        clearTimeout(fadeTimeout);
        body.style.overflow = ''; 
      };
    }
  }, []);

  return (
    <div className="star-container" style={{ position: 'absolute', width: '100%', height: '100vh' }}>
      <Star size={20} delay={0} image={starImage} />
    </div>
  );
};

export default StarAnimation;
