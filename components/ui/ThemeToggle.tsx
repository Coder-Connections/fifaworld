'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="p-2 rounded-lg text-t-muted hover:text-t-text hover:bg-t-subtle transition-colors"
    >
      {theme === 'dark'
        ? <Sun className="w-4 h-4" />
        : <Moon className="w-4 h-4" />}
    </button>
  );
}
