import React, {useState,useContext} from 'react'
import { useForm } from 'react-hook-form'
import './login.css'
import { NavLink } from 'react-router-dom'
import { name } from '../../Context/Context';
import { useNavigate } from 'react-router-dom'

import login from '../../assets/login.mp4'
import Loading from '../loading/Loading';

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
        let submit = await fetch('http://localhost:3045/',{method:"POST",headers: {
          "Content-Type": "application/json" 
        }, body: JSON.stringify(data)})
        let res = await submit.json()
        

        if(res.token){

          localStorage.setItem('token',res.token)
          // console.log('token saved')
        }


        if(res.username!=='"not found"'){
          setNameofuser(res.username);
          setverify(false)
          navigate('/dashboard')
          
        }else{
          setverify(true)
        }

        

    }
    
    
  return (
    <div className='loginpage'>
      <video className='loginbackground' autoPlay loop muted>
        <source src={login}/>
      </video>
      <div className='titles'>
        Note Keeper
      </div>
      <div>
       <form className='loginform' onSubmit={handleSubmit(onSubmit)}>
       {verify?<div className='invalid'>Invalid Credentials </div>:<div></div> }
        <label >Email </label> <br /><input type="email" {...register("email",{required:true})}/> <br />
        <label >Password </label> <br /><input type="password" {...register("password",{required:true})}/> <br />
        {isSubmitting?<button type='submit' disabled={isSubmitting}><Loading/></button>:<button type='submit' >Login</button>}
      </form>
      <NavLink className='signuplink' to={'/signup'}>Create New Account</NavLink>
      </div>
     
    </div>
  )
}

export default Login
