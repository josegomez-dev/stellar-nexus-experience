import { useState, useEffect } from 'react';

export function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentScrollX = window.scrollX;

      setScrollY(currentScrollY);
      setScrollX(currentScrollX);

      if (currentScrollY > lastScrollY) {
        setDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setDirection('up');
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return {
    scrollY,
    scrollX,
    direction,
    isScrollingDown: direction === 'down',
    isScrollingUp: direction === 'up',
  };
}

export function useScrollToTop() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { scrollY } = useScrollPosition();

  useEffect(() => {
    setShowBackToTop(scrollY > 300);
  }, [scrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    showBackToTop,
    scrollToTop,
  };
}
