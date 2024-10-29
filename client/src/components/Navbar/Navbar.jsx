import React,{useContext} from 'react'
import { name } from '../../Context/Context'
import './navbar.css'
import { useNavigate } from 'react-router-dom'
import noteimg from '../../assets/noteimg.png'

const Navbar = () => {
  const navigate = useNavigate()
  const { nameofuser,setNameofuser } = useContext(name);
  function logout(){
    localStorage.removeItem('token')
    localStorage.removeItem('nameofuser')
    setNameofuser('');
    navigate('/')
  }

  return (
    <div className='navbar'>
      <img className='logo' src={noteimg} alt="" />
      <div className='logout'>
          <h1>Hi {nameofuser}</h1>
      <button onClick={logout}>LogOut</button>
      </div>
    
    </div>
  )
}

export default Navbar
