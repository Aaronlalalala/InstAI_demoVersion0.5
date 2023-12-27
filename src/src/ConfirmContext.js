import React, { createContext, useContext, useState } from 'react';

const MyContext = createContext();


const DataProvider = ({ children }) => {
  const [contextData, setContextData] = useState('測試');

  const updateContextData = (newData) => {
    setContextData(newData);
  };

  return (
    <MyContext.Provider value={{ contextData, updateContextData }}>
      {children}
    </MyContext.Provider>
  );
};