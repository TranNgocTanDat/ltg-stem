import './App.css'
import AppRoute from './route/AppRoute'
import { Toaster } from 'sonner'

function App() {
  return (
    <>
      <AppRoute />
      <Toaster position="top-right" richColors />
    </>
  )
}

export default App