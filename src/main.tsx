import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '98.css'
import './index.css' // after 98.css so our resets win
import App from './App.tsx'
import { DESKTOP_ZOOM } from './desktopZoom'

document.documentElement.style.setProperty('--zoom', String(DESKTOP_ZOOM))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
