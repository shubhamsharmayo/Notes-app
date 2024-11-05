import { useState } from 'react'

import './App.css'
import {  createBrowserRouter, RouterProvider } from 'react-router-dom'

import Login from './components/Login/Login'
import Signup from './components/Signup/Signup'
import Dashboard from './components/dashboard/Dashboard'
import NameProvider ,{name} from './Context/Context';
import Starred from './components/starred/Starred'

function App() {
  

  const router= createBrowserRouter([
    {
      path:"/",
      element:<><Login/></>
    },
    {
      path:'/signup',
      element:<><Signup/></>
    },
    {
      path:'/dashboard',
      element:<><Dashboard/></>
    },
    {
      path:'/starred',
      element:<><Starred/></>
    }
    
  ])
  

  return (
    <>
     <NameProvider>
      <RouterProvider router={router} />
    </NameProvider>
    </>
  )
}

export default App
