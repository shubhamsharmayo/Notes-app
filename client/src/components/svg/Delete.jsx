import React, {useEffect,useContext}from 'react'
import './svg.css'
import axios from 'axios';


const Delete = ({datainuse,setdatainuse}) => {


 
    const handleDelete = async (id) => {
      const token = localStorage.getItem('token')
        try {
          console.log(id)
          const data =  await axios.delete(`https://notes-app-inky-zeta.vercel.app/profile/delete/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
            console.log(data)
            if(data.data=='Task deleted'){
              setdatainuse((prevData) =>
                prevData.map((item) =>
                  item._id === id ? { ...item, isDeleting: true } : item
                )
              );
            }
            setTimeout(() => {
              setdatainuse((prevData) => prevData.filter((item) => item._id !== id));
            }, 500);
        } catch (error) {
            console.error('Error deleting Task:', error);
        }
    };
  
    


    

  return (
    <div onClick={()=>handleDelete(datainuse)}>
      <svg fill="white" width="64px" height="64px" viewBox="-2.4 -2.4 28.80 28.80" xmlns="http://www.w3.org/2000/svg" transform="rotate(0)">

<g id="SVGRepo_bgCarrier" stroke-width="0"/>

<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>

<g id="SVGRepo_iconCarrier">

<path d="M5.755,20.283,4,8H20L18.245,20.283A2,2,0,0,1,16.265,22H7.735A2,2,0,0,1,5.755,20.283ZM21,4H16V3a1,1,0,0,0-1-1H9A1,1,0,0,0,8,3V4H3A1,1,0,0,0,3,6H21a1,1,0,0,0,0-2Z"/>

</g>

</svg>
    </div>
  )
}

export default Delete
