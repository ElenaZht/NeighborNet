import './App.css'
import {Routes, Route} from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import SignUpForm from './components/SignUpForm'
import HomePage from './pages/HomePage.jsx'
import AccountPage from './pages/AccountPage.jsx'


function App() {

  return (
    <>
      <NavBar/>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/signup' element={<SignUpForm/>}/>
        <Route path='/account' element={<AccountPage/>}/>
      </Routes>
    </>
  )
}

export default App
