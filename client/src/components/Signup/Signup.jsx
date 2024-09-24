import React, {useState} from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import login from '../../assets/login.mp4'
import './signup.css'
import Loading from '../loading/Loading'

const Signup = () => {

  const [warning, setwarning] = useState("")
  
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
      } = useForm()

      const onSubmit = async (data) => {
        let submit = await fetch('http://localhost:3045/signup',{method:"POST",headers: {
          "Content-Type": "application/json" 
        }, body: JSON.stringify(data)})
        
        let res = await submit.text()
        if(res.replaceAll('"','')=="Email or username Already Exist"){
          setwarning(res.replaceAll('"',''))
          console.log(res.replaceAll('"',''))
            
        }
        else if(res.replaceAll('"','')=="done"){
          navigate('/')
        }
      }
  return (
    <div className='signuppage'>
      <video className='loginbackground' autoPlay loop muted>
        <source src={login}/>
      </video>
      <div>
      <form className='signupform' onSubmit={handleSubmit(onSubmit)}>
        <label >Name </label><input type="text" {...register("name",{required:true})}/> <br />
        <label >Email </label><input type="email" {...register("email",{required:true})}/> <br />
        {warning?<span className='warning'>{warning}</span>:null}
        <label >Username </label><input type="text" {...register("username",{required:true})}/> <br />
        {warning?<span className='warning'>{warning}</span>:null}
        <label >Password </label><input type="password" {...register("password",{required:true})}/> <br />
        {isSubmitting?<button type='submit' disabled={isSubmitting}><Loading/></button>:<button type='submit' >Register</button>}
      </form>
      <NavLink className='loginlink' to={'/'}>Already Have Acoount ?</NavLink>
      </div>
    </div>
  )
}

export default Signup
