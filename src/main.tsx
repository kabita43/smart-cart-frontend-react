
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Apply theme on initial load based on localStorage or system preference
const setInitialTheme = () => {
  const savedTheme = localStorage.getItem('smartCartTheme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Execute theme setup immediately
setInitialTheme();

// Render application
createRoot(document.getElementById("root")!).render(<App />);
