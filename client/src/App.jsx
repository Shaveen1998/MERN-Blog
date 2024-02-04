import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Header from './components/Header'
import FooterCom from './components/Footer'
import { useSelector } from 'react-redux'
import CreatePost from './pages/CreatePost'

export default function App() {

const {currentUser} = useSelector(state=> state.user)

  return (
    <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/about" element={<About />}/>
      <Route path="/signup" element={<Signup />}/>
      <Route path="/signin" element={<Signin />}/>
      <Route 
        path="/dashboard" 
        element={currentUser? <Dashboard />: <Navigate to='/signin'/>}/>
      <Route 
        path="/create-post" 
        element={currentUser && currentUser.isAdmin? <CreatePost />: <Navigate to='/signin'/>}/>
      <Route path="/projects" element={<Projects />}/>    
    </Routes>
    <FooterCom />
    </BrowserRouter>
  )
}
