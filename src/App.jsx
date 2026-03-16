import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import PageTransition from './components/Layout/PageTransition'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import CoursePage from './pages/CoursePage'
import CartPage from './pages/CartPage'
import SubjectLayout from './layouts/SubjectLayout'
import VideoPage from './pages/VideoPage'
import SubjectIndex from './pages/SubjectIndex'
import ChatbotPage from './pages/ChatbotPage'
import CheckoutPage from './pages/CheckoutPage'
import BottomNav from './components/Layout/BottomNav'
import Header from './components/Layout/Header'
import { startKeepAlive } from './lib/keepAlive'

function AnimatedRoutes() {
  const location = useLocation();
  const hideHeader = location.pathname === '/chat' || location.pathname.includes('/video/');

  return (
    <>
      {!hideHeader && <Header />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/auth/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/auth/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
        <Route path="/course/:subjectId" element={<PageTransition><CoursePage /></PageTransition>} />
        <Route path="/cart" element={<PageTransition><CartPage /></PageTransition>} />
        <Route path="/checkout" element={<PageTransition><CheckoutPage /></PageTransition>} />
        <Route path="/chat" element={<PageTransition><ChatbotPage /></PageTransition>} />
        <Route path="/subjects/:subjectId" element={<PageTransition><SubjectLayout /></PageTransition>}>
           <Route index element={<SubjectIndex />} />
           <Route path="video/:videoId" element={<VideoPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
    </>
  )
}

function App() {
  console.log('App component rendering');
  // Ping the Render backend every 14 minutes so the free-tier instance
  // never spins down due to inactivity.
  useEffect(() => {
    startKeepAlive()
  }, [])

  return (
    <BrowserRouter>
      <AnimatedRoutes />
      <BottomNav />
    </BrowserRouter>
  )
}

export default App
