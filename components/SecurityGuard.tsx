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

    // 3. Override Console to hide all output
    const disableConsole = () => {
      const noop = () => {};
      // @ts-ignore
      window.console.log = noop;
      // @ts-ignore
      window.console.info = noop;
      // @ts-ignore
      window.console.warn = noop;
      // @ts-ignore
      window.console.error = noop;
      // @ts-ignore
      window.console.debug = noop;
      // @ts-ignore
      window.console.table = noop;
    };

    // 4. Aggressive Anti-Debugging
    const startAntiDebug = () => {
      const emitDebugger = () => {
        // eslint-disable-next-line no-debugger
        (function() {}.constructor("debugger")());
      };

      const check = () => {
        const start = performance.now();
        emitDebugger();
        const end = performance.now();
        if (end - start > 100) {
          // DevTools is open - take action
          document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#000;color:#fff;font-family:sans-serif;text-align:center;padding:20px;"><div><h1>Pelanggaran Keamanan</h1><p>Alat pengembang tidak diizinkan di platform ini.</p><button onclick="window.location.reload()" style="padding:10px 20px;background:#10b981;border:none;color:#fff;border-radius:8px;cursor:pointer;font-weight:bold;">Muat Ulang Halaman</button></div></div>';
        }
      };

      return setInterval(check, 500);
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
    <div className="select-none outline-none" onContextMenu={(e) => e.preventDefault()}>
      {children}
      <style dangerouslySetInnerHTML={{ __html: `
        body {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
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
