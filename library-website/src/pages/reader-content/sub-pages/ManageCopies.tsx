import React, { useEffect, useState } from 'react';
import './ManageCopies.css'
import { AlterCopyRequest, BookInfoRequest } from '../../../../../library-server/request_type';
import { BookData, BookInfoData } from '../BrowseBook';
import { BorrowStatus } from '../../../../../library-server/query_books';

interface ManageCopiesProps {
    setShowEditor: any;
    book: BookData;
}

function ManageCopies(props: ManageCopiesProps) {
    const [ copiesInfo, setCopiesInfo ] = useState<BookInfoData[]>();
    const [ copyId, setCopyId ] = useState<number>()

    const username = sessionStorage.getItem("username");
    const password = sessionStorage.getItem("password");
    if (username === null || password === null) {
        throw new Error("invalid username / password")
    }
    const query: BookInfoRequest = {
        auth: {
            username: username,
            password: password
        },
        book_id: props.book.book_id
    }
    async function fetchCopiesInfo() {
        let response:BookInfoData[] = await fetch("http://localhost:8080/getBookInfo",
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
        setCopiesInfo(response);
        console.log(response)
    }

    async function addCopy() {
        const username = sessionStorage.getItem("username");
        const password = sessionStorage.getItem("password");
        if (username === null || password === null) {
            throw new Error("invalid username / password")
        }
        const query: AlterCopyRequest = {
            book_id: props.book.book_id,
            auth: {
                username: username,
                password: password
            }
        }
        let response: BorrowStatus | void = await fetch("http://localhost:8080/createBookCopy",
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
                alert(`CHECKOUT FAILURE: ${response.message}`)
            }
        }
        fetchCopiesInfo()
    }

    useEffect(() => {
        fetchCopiesInfo()
        console.log("ManageCopies useEffect")
    },[]);

    function ThDivider() {
        return (
            <th className='TableDivider'>
                <div></div>
            </th>
        )
    }

    function TdDivider() {
        return (
            <td className='TableDivider'>
                <div></div>
            </td>
        )
    }

    return (
        <div style={{position: "fixed", top: 0, bottom: 0, left: 0, right: 0, backgroundColor:"rgba(0,0,0,0.5)", display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', gap:'30px', zIndex:999}}>
            <button className='Common-Button' style={{position: "fixed", right: "30px", top: "30px", fontSize: "20px"}} onClick={() => {props.setShowEditor(false)}}>Close</button>
            <div className="ManageCopiesTable">
                <table style={{borderSpacing: "0 10px", border:0}}>
                    <thead>
                        <tr>
                            <th></th>
                            <th className='FirstCell'>Copy ID</th>
                            <ThDivider />
                            <th>Status</th>
                            <ThDivider />
                            <th>Borrower</th>
                            <ThDivider />
                            <th className='LastCell'>Actions</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {copiesInfo?.map((item) => 
                            <tr>
                                <td className='FillCell'></td>
                                <td className='FirstCell'>{item.copy_id}</td>
                                <TdDivider />
                                <td>{item.status}</td>
                                <TdDivider />
                                <td>{(!item.borrower) ? "N/A" : item.borrower}</td>
                                <TdDivider />
                                <td className='LastCell'>
                                    <button className='Common-Button'>Remove</button>
                                    <button className='Common-Button'>Return</button>
                                </td>
                                <td className='FillCell'></td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className='ManageCopiesTable' style={{padding: "12px", display: "flex", flexDirection:"row", gap:"20px"}}>
                <input type="number" placeholder='Copy ID -- Optional' onChange={(e) => {
                    let strval = e.target.value;
                    let val = (strval === '' ? undefined : Number(strval))
                    setCopyId(val)
                }}></input>
                <button className='Common-Button' onClick={addCopy}>Add Copy</button>
            </div>
        </div>
    )
}

export default ManageCopies