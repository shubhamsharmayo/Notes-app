import React, { createContext, useState, useEffect } from 'react';


export const name = createContext();

const NameProvider = ({ children }) => {
//function that retrieves the value from localStorage, if it exists
    const [nameofuser, setNameofuser] = useState(() => {
        return localStorage.getItem('nameofuser') || ''; // If there's no item in localStorage, default to an empty string
    });

    // useEffect to save the name in localStorage whenever it changes
    useEffect(() => {
        if (nameofuser) {
            localStorage.setItem('nameofuser', nameofuser);
        }
    }, [nameofuser]); // The effect runs whenever nameofuser changes

    return (
        <name.Provider value={{ nameofuser, setNameofuser }}>
            {children}
        </name.Provider>
    );
};

export default NameProvider;