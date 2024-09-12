import React, {useState,useContext} from 'react'
import { useForm } from 'react-hook-form'
import './login.css'
import { NavLink } from 'react-router-dom'
import { name } from '../../Context/Context';
import { useNavigate } from 'react-router-dom'

import login from '../../assets/login.mp4'

const Login = () => {
  const navigate = useNavigate()
  const { setNameofuser } = useContext(name);
    const [verify, setverify] = useState(false)
    
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
      } = useForm()
      const onSubmit = async (data) => {
        let submit = await fetch('https://notes-app-beryl-seven.vercel.app/',{method:"POST",headers: {
          "Content-Type": "application/json" 
        }, body: JSON.stringify(data)})
        let res = await submit.text()
        

        
        if(res!=='"not found"'){
          setNameofuser(res);
          setverify(false)
          navigate('/dashboard')
        }else{
          setverify(true)
        }

        console.log(res,verify)
    }
    
    
  return (
    <div className='loginpage'>
      <video className='loginbackground' autoPlay loop muted>
        <source src={login}/>
      </video>
      <div>
       <form className='loginform' onSubmit={handleSubmit(onSubmit)}>
       {verify?<div className='invalid'>Invalid Credentials </div>:<div></div> }
        <label >Email </label> <br /><input type="email" {...register("email",{required:true})}/> <br />
        <label >Password </label> <br /><input type="password" {...register("password",{required:true})}/> <br />
        <button type='submit' >Login</button>
      </form>
      <NavLink className='signuplink' to={'/signup'}>Create New Account</NavLink>
      </div>
     
    </div>
  )
}

export default Login
