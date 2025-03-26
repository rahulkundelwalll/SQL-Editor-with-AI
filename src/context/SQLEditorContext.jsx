import React, { createContext, useState, useContext } from 'react';

const SQLEditorContext = createContext();

export const SQLEditorProvider = ({ children }) => {
    const [sqlCode, setSqlCode] = useState("-- Write your SQL query here...");

    return (
        <SQLEditorContext.Provider value={{ sqlCode, setSqlCode }}>
            {children}
        </SQLEditorContext.Provider>
    );
};

export const useSQLEditor = () => useContext(SQLEditorContext);
