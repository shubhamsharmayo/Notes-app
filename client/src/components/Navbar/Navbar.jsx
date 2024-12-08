import React, { useContext, useState, useEffect, useRef } from 'react';
import { name } from '../../Context/Context';
import './navbar.css';
import { useNavigate } from 'react-router-dom';
import noteimg from '../../assets/noteimg.svg';
import { NavLink } from 'react-router-dom';
import notenav from '../../assets/notenav.svg';
import starnav from '../../assets/starnav.svg';

const Navbar = () => {
  const navigate = useNavigate();
  const { nameofuser, setNameofuser } = useContext(name);
  const [sidebar, setsidebar] = useState(false);

  // Reference for the sidebar
  const sidebarRef = useRef(null);

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('nameofuser');
    setNameofuser('');
    navigate('/');
  }

  function open() {
    setsidebar(true);
  }

  function close() {
    setsidebar(false);
  }

  // Close sidebar when clicking outside using React ref
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setsidebar(false);
      }
      console.log(event.target)
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='navbar'>
      <div
        ref={sidebarRef}
        className={`sidebar ${sidebar ? 'sidebar-open' : ''}`}
      >
        <img
          onClick={close}
          className={`sidebar-logo ${sidebar ? 'sidebar-logo1' : ''}`}
          src={noteimg}
          alt=""
        />
        <div className={`link ${sidebar ? 'linkdisplay' : ''}`}>
          <NavLink
            className={(e) => (e.isActive ? 'navopen' : 'navlink')}
            to={'/dashboard'}
          >
            <img className='navimg1' src={notenav} alt="" />
            Dashboard
          </NavLink>
        </div>
        <div className={`link ${sidebar ? 'linkdisplay' : ''}`}>
          <NavLink
            className={(e) => (e.isActive ? 'navopen' : 'navlink')}
            to={'/starred'}
          >
            <img className='navimg2' src={starnav} alt="" />
            Starred
          </NavLink>
        </div>
      </div>
      <img onClick={open} className='logo' src={noteimg} alt="" />
      <div className='logout'>
        <h1>Hi {nameofuser}</h1>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
