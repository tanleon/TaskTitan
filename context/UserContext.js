import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState();

    const signIn = (userData) => {
        setUser(userData);
    };

    const signOut = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, setUser, signIn, signOut }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
