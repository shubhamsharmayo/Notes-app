import React, { useContext,useState,useEffect } from 'react'
import { name } from '../../Context/Context'
import { useForm } from 'react-hook-form'
import './dashboard.css'
import Navbar from '../Navbar/Navbar'
import Notes from '../notes/Notes'
import axios from 'axios'
import Loading from '../loading/Loading'


const Dashboard = () => {
  
    const { nameofuser } = useContext(name);
    const [datainuse, setdatainuse] = useState("")
    const [click, setclick] = useState(false)
    const [loader, setloader] = useState(true)
   
    
    function forms(){
      setclick(!click)
    }
    function close(){
      setclick(false)
    }

    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm()
   
    
    
    
    const onSubmit = async (data) => {
      
      const requestData = { ...data, user: nameofuser.replaceAll('"','') };
      
      let submit = await fetch(`https://notes-app-inky-zeta.vercel.app/profile/profile/${nameofuser}`,{
        method: "POST",
        headers: {
          
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(requestData)  
      })
    
      
      let res = await submit.json()
      setdatainuse((prevData) => [...prevData, res])
      console.log(res)
      
      setclick(false)
    }
    
    useEffect(() => {
      const token = localStorage.getItem('token');
      // console.log(nameofuser);
      async function fetch(){
        setloader(true)
        try {
          let submit = await axios.get(`https://notes-app-inky-zeta.vercel.app/profile/${nameofuser.replaceAll('"','')}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })
        
         
         setdatainuse(submit.data)
        //  console.log(submit.data)
         setloader(false)
        } catch (error) {
          console.error(error.response?.data || error.message);
          setloader(false)
        }
       
         }
         fetch()
        }, [nameofuser])
        console.log(datainuse)



  
    
// console.log(datainuse)
  return (
    <div className='dashboard'>
      <Navbar/>
      <div className='notebtncont'>
      <button className='notesbtn' onClick={forms}>Add Note</button>
      </div>
        

        {click?<div className='taskform'>
          <div className='formcontainer'>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <h4>ADD TASK</h4>
          <input className='form-control' type="text" {...register("title")} placeholder="Title" />
          <textarea  className='form-control' type="text" {...register("description")} placeholder="Description" ></textarea>
          <span className='colors'><label >Background  </label><input type="color" className='colorbtn'  {...register("color")} /></span>
          <div className='formbtn'>
          <button onClick={close} >Close</button>
          {isSubmitting?<button type="submit" disabled={isSubmitting}><Loading/></button>:<button  type="submit"  >Done</button>}
          </div>
        </form>
        </div>
        </div>:null}
        
        {loader ? (
          <div className='contentloader'><Loading/></div>
        
      ) : datainuse ? (
        <div className="dot">
          
          <Notes datainuse={datainuse} setdatainuse={setdatainuse}/>
        </div>
      ) : null}
      </div>
        
      
  )
}

export default Dashboard
