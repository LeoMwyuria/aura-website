import React, { useState, useEffect } from 'react';

const ScrollToTopButton: React.FC = () => {
  const [showButton, setShowButton] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
     
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 190) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 p-3 px-5 bg-custom-purple text-white rounded-full shadow-lg hover:bg-violet-600 transition duration-300"
        >
          ↑
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;
