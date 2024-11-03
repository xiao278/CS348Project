import React, {useState} from 'react';
import "./ReaderPage.css";
import Browse from './reader-content/BrowseBook.tsx';

function ReaderPage(setPage) {
    const [tab, setTab] = useState('browse');

    function renderContent() {
        if (tab === 'browse') return <Browse />;
    }

    return (
            <div className='Reader-Container'>
                <div className='Navbar'>
                    <button onClick={() => setTab('browse')} className={(tab === 'browse') ? "Nav-Selected" : "Nav-Unselected"}>Browse books</button>
                    <button onClick={() => setTab('borrow')} className={(tab === 'borrow') ? "Nav-Selected" : "Nav-Unselected"}>Borrowed books</button>
                    <button onClick={() => setTab('wishlist')} className={(tab === 'wishlist') ? "Nav-Selected" : "Nav-Unselected"}>Wishlist</button>
                    <button onClick={() => setTab('issues')} className={(tab === 'issues') ? "Nav-Selected" : "Nav-Unselected"}>Issues</button>
                </div>
                {renderContent()}
            </div>
        );
    }

    export default ReaderPage;