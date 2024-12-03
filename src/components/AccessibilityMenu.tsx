import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Sun, Moon, ZoomIn, ZoomOut, Type } from 'lucide-react';

export function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [contrast, setContrast] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const toggleMenu = () => setIsOpen(!isOpen);

  const increaseFontSize = () => {
    if (fontSize < 150) {
      setFontSize(prev => prev + 10);
      document.documentElement.style.fontSize = `${fontSize + 10}%`;
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 90) {
      setFontSize(prev => prev - 10);
      document.documentElement.style.fontSize = `${fontSize - 10}%`;
    }
  };

  const toggleContrast = () => {
    setContrast(!contrast);
    document.documentElement.classList.toggle('high-contrast');
  };

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('light-mode');
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={toggleMenu}
        className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg"
        aria-label="תפריט נגישות"
      >
        <Settings className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 left-0 bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-xl p-4 space-y-3"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-purple-600/20"
                aria-label={isDark ? "מצב יום" : "מצב לילה"}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <span className="text-sm text-gray-300">מצב {isDark ? "לילה" : "יום"}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={increaseFontSize}
                className="p-2 rounded-lg hover:bg-purple-600/20"
                aria-label="הגדל טקסט"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={decreaseFontSize}
                className="p-2 rounded-lg hover:bg-purple-600/20"
                aria-label="הקטן טקסט"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-300">גודל טקסט</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleContrast}
                className="p-2 rounded-lg hover:bg-purple-600/20"
                aria-label="שנה ניגודיות"
              >
                <Type className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-300">ניגודיות</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}