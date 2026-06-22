import { useState } from 'react'
import Desktop from './components/Desktop'
import StartupScreen from './components/StartupScreen'
import LoginScreen from './components/LoginScreen'
import ShutDownScreen from './components/ShutDownScreen'
import { WindowManagerProvider } from './context/WindowManager'

type Phase = 'startup' | 'login' | 'desktop' | 'shutdown'

function App() {
  const [phase, setPhase] = useState<Phase>('startup')

  if (phase === 'startup') {
    return <StartupScreen onDone={() => setPhase('login')} />
  }

  if (phase === 'login') {
    return <LoginScreen onLogin={() => setPhase('desktop')} />
  }

  if (phase === 'shutdown') {
    return <ShutDownScreen onRestart={() => setPhase('startup')} />
  }

  return (
    <WindowManagerProvider>
      <Desktop onShutDown={() => setPhase('shutdown')} />
    </WindowManagerProvider>
  )
}

export default App
