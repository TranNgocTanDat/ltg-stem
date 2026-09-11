import './App.css'
import AppRoute from './route/AppRoute'
import { Toaster } from 'sonner'

function App() {
  return (
    <>
      <AppRoute />
      <Toaster position="bottom-right" richColors />
    </>
  )
}

export default App