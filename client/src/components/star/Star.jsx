import React from 'react'
import starempty from '../../assets/starempty.svg'
import './star.css'
import axios from 'axios'

const Star = ({datainuse,setdatainuse}) => {

 async function data(){
  const token = localStorage.getItem('token');
  try{
  console.log(datainuse._id)
  const obj = {
    
    "starred":true
  }
    let submit = await axios.put(`https://notes-app-inky-zeta.vercel.app/profile/star/${datainuse._id}`,obj, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    console.log(submit)
    if(submit.status=== 200){
      const updated = submit.data
      setdatainuse((prevdata)=> 
        prevdata.map((data)=>data._id==updated._id ? updated : data)
      )
    }
  }catch(err){
    console.error('Error updating star status:', err);
  }
  }
    
  return (
    <div className='starbox'>
      <img onClick={data} className='stars' src={starempty} alt="" />
      <span className='starlabel'>Star</span>
    </div>
  )
}

export default Star
