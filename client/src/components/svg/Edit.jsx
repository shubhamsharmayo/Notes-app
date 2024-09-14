import React, { useState } from "react";
import "./svg.css";
import axios from "axios";
import { useForm } from "react-hook-form";
import "./edit.css";

const Edit = ({ datainuse, setdatainuse }) => {
  const [isEditing, setIsEditing] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleEdit = (note) => {
    setIsEditing(note._id);
    reset(note);
  };

  const handleUpdate = async (formData) => {
    try {
      const response = await axios.put(
        `https://backend-beta-ruby.vercel.app/profile/update/${isEditing}`,
        formData
      );
      if (response.status === 200) {
        const updatedNote = response.data;
        setdatainuse((prevData) =>
          prevData.map((item) =>
            item._id === updatedNote._id ? updatedNote : item
          )
        );
        setIsEditing(null);
        reset();
      } else {
        console.error("Failed to update the note");
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  return (
    <div>
      <div onClick={() => handleEdit(datainuse)}>
        <svg
          width="64px"
          height="64px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0" fill="white" />
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <g id="SVGRepo_iconCarrier">
            <path
              d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>

      {isEditing && (
        <div className="taskform2 ">
          <div className="formcontainer2">
            <form  onSubmit={handleSubmit(handleUpdate)}>
              <h4>EDIT TASK</h4>
              <input
                className="edit-control-title"
                type="text"
                {...register("title")}
                placeholder="Title"
              />

              <textarea
                className="edit-control"
                type="text"
                {...register("description")}
                placeholder="Description"
              ></textarea>

              <div>
                <label>Background </label>
                <input type="color" className="color" {...register("color")} />
              </div>

              <div className="editbtn2">
                <button type="button" onClick={() => setIsEditing(null)}>
                  Close
                </button>
                <button type="submit" disabled={isSubmitting}>
                  Done
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Edit;
