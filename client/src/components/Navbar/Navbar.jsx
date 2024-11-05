import React,{useContext,useState} from 'react'
import { name } from '../../Context/Context'
import './navbar.css'
import { useNavigate } from 'react-router-dom'
import noteimg from '../../assets/noteimg.svg'
import { NavLink } from 'react-router-dom'
import notenav from '../../assets/notenav.svg'
import starnav from '../../assets/starnav.svg'

const Navbar = () => {
  const navigate = useNavigate()
  const { nameofuser,setNameofuser } = useContext(name);
  const [sidebar, setsidebar] = useState(false)
  function logout(){
    localStorage.removeItem('token')
    localStorage.removeItem('nameofuser')
    setNameofuser('');
    navigate('/')
  }

  function open(){
    setsidebar(true)
  }
  function close(){
    setsidebar(false)
  }

  

  return (
    <div className='navbar'>
      <div className={`sidebar ${sidebar ? 'sidebar-open': ''}`}>
      <img onClick={close} className={`sidebar-logo ${sidebar ? 'sidebar-logo1':''}`} src={noteimg} alt="" />
      <div className={`link ${sidebar ? 'linkdisplay':''}`}> <img className='navimg1' src={notenav} alt="" /><NavLink className="navlink" to={'/dashboard'}>Dashboard</NavLink></div>
      <div className={`link ${sidebar ? 'linkdisplay':''}`}> <img className='navimg2' src={starnav} alt="" /><NavLink className="navlink" to={'/starred'}>Starred</NavLink></div>
      
      
      
      </div>
      <img onClick={open} className='logo'  src={noteimg}  alt="" />
      <div className='logout'>
          <h1>Hi {nameofuser}</h1>
      <button onClick={logout}>Logout</button>
      </div>
    
    </div>
  )
}

export default Navbar
