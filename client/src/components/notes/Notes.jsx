import React from 'react'
import './note.css'
import Edit from '../svg/Edit'
import Delete from '../svg/Delete'
import Star from '../star/Star'
import StarFilled from '../star/StarFilled'
import AOS from 'aos';
import 'aos/dist/aos.css'; 


const Notes = ({ datainuse, setdatainuse }) => {



  return (
    <div className='main' >
      <div className='card' >
        <ul className='list' >
          {datainuse.map((data, index) => (
            <li data-aos="zoom-in" className={`listcard ${data.isDeleting ? 'deleting' : ''}`} style={{ background: data.color }} key={index}>
              <h3 className='title' >{data.title}</h3>
              <div className='starmark'>{data.starred ? <StarFilled datainuse={data} setdatainuse={setdatainuse} /> : <Star datainuse={data} setdatainuse={setdatainuse} />}</div>
              <div className='descdiv'><p className='desc'>{data.description}</p></div>
              <div className='cardbtn'>
                <div className='date'>
                  <p>{data.date}</p>
                </div>
                <div className='buttons'>
                  <div className='editbtn'>
                    <Edit datainuse={data} setdatainuse={setdatainuse} />
                    <span className='editlabel'>Edit</span>
                  </div>
                  <div className="deletebtn">
                    <Delete datainuse={data._id} setdatainuse={setdatainuse} />
                    <span className='deletelabel'>Delete</span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Notes
