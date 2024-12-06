import React, { useState } from 'react';
import Login from './pages/Login.tsx';
import ReaderPage from './pages/ReaderPage.tsx';
import { Credentials } from './GeneralIntefaces.ts';
import './App.css';

function App() {
    const [page, setPage] = useState('login'); // State to track the current page
    const [ tables, setTables ] = useState<object | null>(null);
    // const [ credentials, setCredentials ] = useState<Credentials>({username:"",  password:""});

    const renderPage = () => {
        if (page === 'login') return <Login setPage={setPage}/>;
        if (page === 'reader') return <ReaderPage setPage={setPage} tables={tables} setTables={setTables}/>;
    };

    return (
        <div>
            {renderPage()}
        </div>
    );
}


export default App;
