import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import MainPage from './pages/MainPage'
import CustomizePage from './pages/CustomizePage'

function App() {
  return (
    <div className="flex h-screen bg-[#0f172a] text-[#f8fafc]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/customize" element={<CustomizePage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
