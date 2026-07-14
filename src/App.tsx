import { useState } from 'react'
import Desktop from './components/Desktop'
import LoginScreen from './components/LoginScreen'
import ShutDownScreen from './components/ShutDownScreen'
import MobileGate from './components/MobileGate'
import { WindowManagerProvider } from './context/WindowManager'

type Phase = 'login' | 'desktop' | 'shutdown'

function App() {
  const [phase, setPhase] = useState<Phase>('login')

  let content
  if (phase === 'login') {
    content = <LoginScreen onLogin={() => setPhase('desktop')} />
  } else if (phase === 'shutdown') {
    content = <ShutDownScreen onRestart={() => setPhase('login')} />
  } else {
    content = (
      <WindowManagerProvider>
        <Desktop onShutDown={() => setPhase('shutdown')} />
      </WindowManagerProvider>
    )
  }

  return (
    <>
      {content}
      <MobileGate />
    </>
  )
}

export default App
