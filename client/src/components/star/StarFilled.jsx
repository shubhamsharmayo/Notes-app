import React from 'react'
import starfilled from '../../assets/starfilled.svg'
import './star.css'
import axios from 'axios'

const StarFilled = ({datainuse,setdatainuse}) => {

  async function datas(){
    try{
    console.log(datainuse)
    const obj1 = {
     
      "starred":false
    }
      let submit = await axios.put(`https://notes-app-inky-zeta.vercel.app/profile/unstar/${datainuse._id}`,obj1)
      // console.log(submit)
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
    <div  className='starbox'>
      <img onClick={datas} className='starsfilled' src={starfilled} alt="" />
      <span className='starlabel'>Unstar</span>
    </div>
  )
}

export default StarFilled
