import { useState } from 'react'
import Desktop from './components/Desktop'
import LoginScreen from './components/LoginScreen'
import ShutDownScreen from './components/ShutDownScreen'
import { WindowManagerProvider } from './context/WindowManager'

type Phase = 'login' | 'desktop' | 'shutdown'

function App() {
  const [phase, setPhase] = useState<Phase>('login')

  if (phase === 'login') {
    return <LoginScreen onLogin={() => setPhase('desktop')} />
  }

  if (phase === 'shutdown') {
    return <ShutDownScreen onRestart={() => setPhase('login')} />
  }

  return (
    <WindowManagerProvider>
      <Desktop onShutDown={() => setPhase('shutdown')} />
    </WindowManagerProvider>
  )
}

export default App
