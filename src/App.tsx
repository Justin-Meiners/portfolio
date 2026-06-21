import Desktop from './components/Desktop'
import { WindowManagerProvider } from './context/WindowManager'

function App() {
  return (
    <WindowManagerProvider>
      <Desktop />
    </WindowManagerProvider>
  )
}

export default App
