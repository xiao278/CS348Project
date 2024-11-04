import React, {useState} from 'react';
import "./ReaderPage.css";
import Browse from './reader-content/BrowseBook.tsx';

function ReaderPage({credentials, setPage, tables, setTables}) {
    const [tab, setTab] = useState('browse');

    function renderContent() {
        if (tab === 'browse') return <Browse credentials={credentials} setTables={setTables} tables={tables} />;
    }

    return (
            <div className='Reader-Container'>
                <div className='Navbar'>
                    <button onClick={() => setTab('browse')} className={(tab === 'browse') ? "Nav-Selected" : "Nav-Unselected"}>Browse books</button>
                    <button onClick={() => setTab('borrow')} className={(tab === 'borrow') ? "Nav-Selected" : "Nav-Unselected"}>Borrowed books</button>
                    <button onClick={() => setTab('wishlist')} className={(tab === 'wishlist') ? "Nav-Selected" : "Nav-Unselected"}>Wishlist</button>
                    <button onClick={() => setTab('issues')} className={(tab === 'issues') ? "Nav-Selected" : "Nav-Unselected"}>Issues</button>
                    <button onClick={() => setTab('account')} className={(tab === 'account') ? "Nav-Selected" : "Nav-Unselected"}>Account</button>
                </div>
                {renderContent()}
            </div>
        );
    }

    export default ReaderPage;