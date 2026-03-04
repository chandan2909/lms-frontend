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

function App() {
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
