let lockedHeight = null;
let isLocked = false;

export const lockViewport = () => {
  // Capture the initial "maximum" height when page loads
  // This is the height WITH browser UI hidden
  const captureMaxHeight = () => {
    setTimeout(() => {
      lockedHeight = window.innerHeight;
      isLocked = true;
      updateViewportHeight(lockedHeight);
    }, 300); // Wait for browser UI to auto-hide on mobile
  };

  const updateViewportHeight = (height) => {
    const vh = height * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--locked-vh', `${height}px`);
  };

  const onResize = () => {
    const currentHeight = window.innerHeight;
    
    if (!isLocked) {
      // First load - capture the max height
      if (currentHeight > (lockedHeight || 0)) {
        lockedHeight = currentHeight;
      }
      updateViewportHeight(lockedHeight || currentHeight);
      return;
    }

    // Calculate height difference
    const heightDiff = Math.abs(currentHeight - lockedHeight);
    
    // Only update if it's a SIGNIFICANT change (orientation/window resize)
    // Ignore browser UI collapse (typically 50-100px on mobile)
    if (heightDiff > 150) {
      lockedHeight = currentHeight;
      updateViewportHeight(currentHeight);
    } else {
      // Keep using locked height - ignore browser UI changes
      updateViewportHeight(lockedHeight);
    }
  };

  // Initial capture
  captureMaxHeight();
  
  // Re-capture on orientation change
  window.addEventListener('orientationchange', () => {
    isLocked = false;
    captureMaxHeight();
  });

  window.addEventListener('resize', onResize);

  return () => {
    window.removeEventListener('resize', onResize);
    window.removeEventListener('orientationchange', captureMaxHeight);
  };
};