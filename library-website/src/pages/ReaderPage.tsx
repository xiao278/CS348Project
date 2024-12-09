import React, {useState} from 'react';
import "./ReaderPage.css";
import Browse from './reader-content/BrowseBook.tsx';
import { BookQuery } from "../../../library-server/request_type";
import Account from './reader-content/Account.tsx';
import Borrows from './reader-content/Borrows.tsx';


function ReaderPage({setPage, tables, setTables}) {
    const [tab, setTab] = useState('browse');
    const [ curFilters, setCurFilters ] = useState<BookQuery | null>(null)
    const [ curPage, setCurPage ] = useState(1)
    const [ queryStats, setQueryStats ] = useState<any>({num_books: 0, num_pages: 0})

    function renderContent() {
        if (tab === 'browse') return <Browse 
            setTables={setTables} 
            tables={tables}
        />;

        if (tab === 'account') return <Account 
            setPage={setPage}
        />;

        if (tab === 'borrow') return <Borrows 
            setPage={setPage}
        />
    }

    return (
            <div className='Reader-Container'>
                <div className='Navbar'>
                    <button onClick={() => setTab('browse')} className={(tab === 'browse') ? "Nav-Selected" : "Nav-Unselected"}>Browse books</button>
                    <button onClick={() => setTab('borrow')} className={(tab === 'borrow') ? "Nav-Selected" : "Nav-Unselected"}>Borrowed books</button>
                    {sessionStorage.getItem("role") === "staff" ? (
                        <button onClick={() => setTab('add')} className={(tab === 'add') ? "Nav-Selected" : "Nav-Unselected"}>Add books</button> 
                    ): <></>}
                    <button onClick={() => setTab('stats')} className={(tab === 'stats') ? "Nav-Selected" : "Nav-Unselected"}>Library Statistics</button>
                    <button onClick={() => setTab('account')} className={(tab === 'account') ? "Nav-Selected" : "Nav-Unselected"}>Account</button>
                </div>
                {renderContent()}
            </div>
        );
    }

    export default ReaderPage;