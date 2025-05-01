import React, { useContext, useState, useEffect } from 'react';
import { name } from '../../Context/Context';
import { useForm } from 'react-hook-form';
import './dashboard.css';
import Navbar from '../Navbar/Navbar';
import Notes from '../notes/Notes';
import axios from 'axios';
import Loading from '../loading/Loading';

const Dashboard = () => {
  const { nameofuser } = useContext(name);
  const [datainuse, setdatainuse] = useState([]);
  const [click, setclick] = useState(false);
  const [loader, setloader] = useState(true);
  const [editData, setEditData] = useState(null); // used to check if editing

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  function forms(data) {
    if (data) {
      setEditData(data);
      reset(data);
      setclick(true); // show form immediately for editing
    } else {
      setEditData("");
      reset({}, { keepValues: false }); // full reset
      setTimeout(() => setclick(true), 50); // delay opening the form to ensure reset applied
    }
  }

  function closes() {
    setclick(false);
    setEditData(null);
    reset(); // clear form
  }

  const onSubmit = async (data) => {
    const requestData = { ...data, user: nameofuser.replaceAll('"', '') };
    const token = localStorage.getItem('token');

    try {
      if (editData) {
        // Edit note
        const response = await axios.put(
          `https://notes-app-inky-zeta.vercel.app/profile/update/${editData._id}`,
          requestData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        setdatainuse((prevData) =>
          prevData.map((note) =>
            note._id === response.data._id ? response.data : note
          )
        );
      } else {
        // Add new note
        const submit = await fetch(`https://notes-app-inky-zeta.vercel.app/profile/profile/${nameofuser}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });
        const res = await submit.json();
        setdatainuse((prev) => [...prev, res]);
      }

      setclick(false);
      setEditData(null);
      reset();
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    async function fetchData() {
      setloader(true);
      try {
        let submit = await axios.get(
          `https://notes-app-inky-zeta.vercel.app/profile/${nameofuser.replaceAll('"', '')}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        setdatainuse(submit.data);
        setloader(false);
      } catch (error) {
        console.error(error.response?.data || error.message);
        setloader(false);
      }
    }
    fetchData();
  }, [nameofuser]);

  useEffect(() => {
    let prevscroll = window.scrollY;
    const handlescroll = () => {
      const currentscroll = window.scrollY;
      const diff = currentscroll - prevscroll;

      if (diff > 25 || diff < -25) {
        setclick(false);
        setEditData(null);
      }
      prevscroll = currentscroll;
    };

    window.addEventListener('scroll', handlescroll);
  }, []);

  useEffect(() => {
    if (!editData) {
      reset();
    }
  }, [editData, reset]);

  return (
    <div className='dashboard'>
      <Navbar />
      <div className='dashboard-main'>
        <div className='notebtncont'>
          <button className='notesbtn' onClick={() => forms()}>+</button>
        </div>

        <div className={`taskform ${click ? 'show' : ''}`}>
          <div className={`formcontainer`}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <h4>{editData ? 'EDIT TASK' : 'ADD TASK'}</h4>
              <input className='form-control' type="text" {...register("title")} placeholder="Title" />
              <textarea className='form-control' type="text" {...register("description")} placeholder="Description"></textarea>
              <span className='colors'>
                <label>Background </label>
                <input type="color" className='colorbtn' {...register("color")} />
              </span>
              <div className='formbtn'>
                <button type='button' onClick={closes}>Close</button>
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loading size={15} /> : "Done"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {loader ? (
          <div className='contentloader'><Loading size={50} /></div>
        ) : datainuse ? (
          <div className="dot">
            <Notes datainuse={datainuse} setdatainuse={setdatainuse} forms={forms} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Dashboard;
