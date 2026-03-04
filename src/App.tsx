import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import CoursePage from './pages/CoursePage'
import CartPage from './pages/CartPage'
import SubjectLayout from './layouts/SubjectLayout'
import VideoPage from './pages/VideoPage'
import SubjectIndex from './pages/SubjectIndex'
import { startKeepAlive } from './lib/keepAlive'

function App() {
  // Ping the Render backend every 14 minutes so the free-tier instance
  // never spins down due to inactivity.
  useEffect(() => {
    startKeepAlive()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/course/:subjectId" element={<CoursePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/subjects/:subjectId" element={<SubjectLayout />}>
           <Route index element={<SubjectIndex />} />
           <Route path="video/:videoId" element={<VideoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
