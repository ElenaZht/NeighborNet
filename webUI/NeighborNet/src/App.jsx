import './App.css'
import {Routes, Route} from 'react-router-dom'
import NavBar from './components/NavBar'
import SignUpForm from './components/SignUpForm'
import HomePage from './pages/HomePage.jsx'


function App() {

  return (
    <>
      <NavBar/>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/signup' element={<SignUpForm/>}/>
      </Routes>
    </>
  )
}

export default App
