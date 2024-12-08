import React, {useState,useContext,useEffect} from 'react'
import { name } from '../../Context/Context'
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import Loading from '../loading/Loading';
import Starnotes from '../StarNotes/Starnotes';
import './starred.css'

const Starred = () => {
  const { nameofuser } = useContext(name);
  const [loader, setloader] = useState(true)
  const [starredData, setstarredData] = useState("")


  useEffect(() => {
    // console.log(nameofuser)
    const token = localStorage.getItem('token');
 async function starrednotes() {
    setloader(true)
    try{
    const submited = await axios.get(`https://notes-app-inky-zeta.vercel.app/profile/starred/${nameofuser.replaceAll('"','')}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    // console.log(submited.data)
    setstarredData(submited.data)
    setloader(false)
    }catch(err){
      console.log(err)
      setloader(false)
    }
  }
  starrednotes()
  // console.log( starrednotes())
}, [nameofuser])


  console.log(starredData.data)

  
  return (
    <div className='dashboard'>
      <Navbar/>
      <div className='star-main'>
      {loader ? (
          <div className='contentloader'><Loading/></div>
        
      ) : starredData ? (
        <div className="dot">
          
          <Starnotes starredData={starredData} setstarredData={setstarredData}/>
        </div>
      ) : null}
      </div>
    </div>
  )
}

export default Starred
