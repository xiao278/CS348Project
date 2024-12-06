import React, { useEffect, useState } from 'react';
import { BorrowRequest, LoginPayload } from '../../../../library-server/request_type';
import { BookData } from './BrowseBook';
import { BorrowStatus } from '../../../../library-server/query_books';

interface BorrowProps {
    setPage: any;
}

interface CopyData{
    Book: BookData;
    copy_id: number;
}

interface BorrowRes {
    borrows: CopyData[];
    limit: number;
}

interface BookCardProps {
    data: CopyData
}

function BookCard(props: BookCardProps) {
    const data = props.data.Book
    
    const extractAuthorNames = (list: BookData['Authors']) => {
        try {
            if (list.length === 0) return "N/A";
            let names:string[] = [];
            list.map((item) => names.push(item.name));
            return names.join(", ");
        } catch(e) {
            console.log(props);
            console.log(e);
            return "N/A: Error";
        }
    }

    const extractGenres = ((list: BookData['Genres']) => {
        try {
            if (list.length === 0) return "N/A";
            let genres:string[] = [];
            list.map((item) => genres.push(item.genre));
            return genres.join(", ");
        } catch(e) {
            console.log(props);
            console.log(e);
            return "N/A: Error";
        }
    });

    async function returnBook() {
        const username = sessionStorage.getItem("username");
        const password = sessionStorage.getItem("password");
        if (username === null || password === null) {
            throw new Error("invalid username / password")
        }
        const query: BorrowRequest = {
            book_id: data.book_id,
            auth: {
                username: username,
                password: password
            }
        }
        let response: BorrowStatus | void = await fetch("http://localhost:8080/returnBook",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(query)
            }
        ).then(res => {
            if (res.ok) {
                return res.json();
            }
        });
        if (response !== undefined) {
            if (!response.success) {
                alert(`RETURN FAILURE: ${response.message}`)
            }
        }
    }

    return (
        <div className='Book-Card-Container'>
            <div className='Info-Container'>
                <div>Book ID: {data.book_id}</div>
                <div>Copy ID: {props.data.copy_id}</div>
                <div>Title: {data.title}</div>
                <div>Author(s): {extractAuthorNames(data.Authors)}</div>
            </div>
            <div className='Buttons-Container'>
                <button className='More-Button Common-Button' onClick={returnBook}>Return Book</button>
            </div>
        </div>
    )
}

function Borrows(props: BorrowProps) {
    const [ lookupRes, setLookupRes ] = useState<BorrowRes>();

    const username = sessionStorage.getItem("username");
    const password = sessionStorage.getItem("password");
    if (!username || !password) {
        throw new Error("invalid username / password")
    };

    const query: LoginPayload = {
        username: username,
        password: password
    };

    async function fetchBorrows() {
        const response: BorrowRes = await fetch("http://localhost:8080/getBorrows",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(query)
            }
        ).then((res) => {
            if (res.ok) {
                return res.json()
            }
        });
        setLookupRes(response)
    }

    useEffect(() => {
        fetchBorrows();
    })

    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <h1 style={{textAlign: "center", backgroundColor: "#25283D", color: "#EEEEFF", padding: "15px", margin: 0}}>You have borrowed {lookupRes?.borrows.length}/{lookupRes?.limit} books.</h1>
            <div style={{
                height: "100%", display: "flex", flexDirection: "column", overflow: "scroll"
            }}>
                {lookupRes?.borrows.map((item) => <BookCard 
                    data={item} key={item.Book.book_id}
                />)}
            </div>
        </div>
    )
}

export default Borrows