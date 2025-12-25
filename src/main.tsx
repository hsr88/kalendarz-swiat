import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
// 👇 TA LINIA JEST NAJWAŻNIEJSZA! Bez niej Tailwind nie działa.
import './index.css' 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)