'use client';

import { useEffect } from 'react';

interface ConsoleTextProps {
  text: string;
  className?: string;
}

export function ConsoleText({ text, className = '' }: ConsoleTextProps) {
  useEffect(() => {
    const consoleText = (word: string, id: string) => {
      let visible = true;
      const con = document.getElementById('console');
      let letterCount = 0;
      let blinkCount = 0;
      const target = document.getElementById(id);
      
      if (!target || !con) return;

      // Type the text once
      const typeInterval = setInterval(() => {
        if (letterCount < word.length) {
          target.innerHTML = word.substring(0, letterCount + 1);
          letterCount++;
        } else {
          clearInterval(typeInterval);
          
          // Start final blink sequence after typing is done
          const finalBlinkInterval = setInterval(() => {
            if (visible === true) {
              con.className = 'console-underscore console-hidden';
              visible = false;
            } else {
              con.className = 'console-underscore';
              visible = true;
              blinkCount++;
            }
            
            // Hide cursor after 3 blinks
            if (blinkCount >= 3) {
              clearInterval(finalBlinkInterval);
              con.className = 'console-underscore console-hidden';
            }
          }, 400);
        }
      }, 120);

      return () => {
        clearInterval(typeInterval);
      };
    };

    const cleanup = consoleText(text, 'welcome-text');
    return cleanup;
  }, [text]);

  return (
    <div className="console-container">
      <span id="welcome-text" className={className}></span>
      <div className="console-underscore" id="console">_</div>
    </div>
  );
}