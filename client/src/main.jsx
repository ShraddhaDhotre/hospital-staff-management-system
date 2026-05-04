import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { THEME_STORAGE_KEY } from './hooks/useTheme.js'

const stored = localStorage.getItem(THEME_STORAGE_KEY)
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
document.documentElement.dataset.theme =
  stored === 'dark' || stored === 'light' ? stored : prefersDark ? 'dark' : 'light'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
