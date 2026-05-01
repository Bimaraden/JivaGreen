import React, { useEffect } from 'react';

const SecurityGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // 1. Disable Right Click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // 2. Disable Keyboard Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, Ctrl+S
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toLowerCase() === 'u') ||
        (e.ctrlKey && e.key.toLowerCase() === 's')
      ) {
        e.preventDefault();
        return false;
      }
    };

    // 3. Console access remains for standard debugging
    const disableConsole = () => {
      // Re-enabled console as it can interfere with some mobile browser behaviors
    };

    // 4. Relaxed Anti-Debugging for mobile compatibility
    const startAntiDebug = () => {
      // Disabled aggressive debugger injection which often causes hangs on mobile
      // and false positives on slower devices.
      return setInterval(() => {}, 1000);
    };

    // 5. Detect DevTools via window size (only works if docked)
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        // DevTools likely open and docked
        // console.clear();
      }
    };

    disableConsole();
    const debugInterval = startAntiDebug();
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', detectDevTools);

    // Periodically clear console just in case
    const clearInt = setInterval(() => {
      // @ts-ignore
      if (window.console && window.console.clear) {
        // window.console.clear();
      }
    }, 1000);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', detectDevTools);
      clearInterval(debugInterval);
      clearInterval(clearInt);
    };
  }, []);

  return (
    <div className="outline-none" onContextMenu={(e) => e.preventDefault()}>
      {children}
      <style dangerouslySetInnerHTML={{ __html: `
        body {
          -webkit-touch-callout: none;
        }
        /* Prevent viewing source via context menu on images */
        img {
          pointer-events: none;
        }
      `}} />
    </div>
  );
};

export default SecurityGuard;
