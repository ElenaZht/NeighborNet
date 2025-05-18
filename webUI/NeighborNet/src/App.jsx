import './App.css'
import {Routes, Route} from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import SignUpForm from './components/SignUpForm'
import HomePage from './pages/HomePage.jsx'
import AccountPage from './pages/AccountPage.jsx'
import LogInForm from './components/LogInForm.jsx'


function App() {

  return (
    <>
      <NavBar/>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/signup' element={<SignUpForm/>}/>
        <Route path='/account' element={<AccountPage/>}/>
        <Route path='/login' element={<LogInForm/>} />
      </Routes>
    </>
  )
}

export default App
