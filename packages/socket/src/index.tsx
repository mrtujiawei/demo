import { createRoot } from 'react-dom/client';
import App from './App';

const el = document.createElement('div');

createRoot(el).render(<App />);

document.body.appendChild(el);
