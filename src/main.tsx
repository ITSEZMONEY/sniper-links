import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeAnalytics } from './config/analytics'

// Initialize analytics
initializeAnalytics();

createRoot(document.getElementById("root")!).render(<App />);
