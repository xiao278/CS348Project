import React, { useEffect, useState } from 'react';
import "./BrowseBook.css"
import { Credentials, BrowseTables } from "../../GeneralIntefaces";
import { BookQuery } from "../../../../library-server/request_type";

interface BookData extends Object {
    book_id: number;
    title: string;
    Publisher: any;
    Language: any;
    Authors: any;
    Genres: any[];
}

interface BookCardProps {
    data: BookData;
    setDataCardInfo: any;
}

interface BrowseProps {
    credentials: Credentials
    tables: BrowseTables | null;
    setTables: any
}

function BookCard(props: BookCardProps) {
    const data = props.data
    console.log(data.Authors.length)
    const setDataCardInfo = props.setDataCardInfo

    const extractAuthorNames = (list) => {
        let names:string[] = [];
        list.map((item) => names.push(item.name));
        return names.toString();
    }
    
    return (
        <div className='Book-Card-Container'>
            <div className='Info-Container'>
                <div>Title: {data.title}</div>
                <div>Author(s): {extractAuthorNames(data.Authors)}</div>
                <div>Published By: {"N/A"}</div>
                <div>Language: {data.Language === null ? "N/A" : data.Language.language}</div>
                <div>Genre(s): {"N/A"}</div>
            </div>
            <div className='Buttons-Container'>
                <button className='More-Button'>More</button>
                <button className='Bookmark-Button'>Bookmark</button>
            </div>
        </div>
    )
}

function Browse(props: BrowseProps) {
    const tables = props.tables;
    const setTables = props.setTables;
    const [ books, setBooks ] = useState<BookData[]>([]);
    const [ lang, setLang ] = useState("");
    const [ title, setTitle ] = useState("");
    const [ author, setAuthor ] = useState("");
    const [ publisher, setPublisher ] = useState("");

    async function fetchBookData(filters) {
        let lang_id = 0;
        if (tables != null) {
            for (let i:number = 0; i < tables.languages.length; i++) {
                let item = tables.languages[i]
                if (lang === item.language) {
                    lang_id = item.lang_id;
                    break;
                }
            }
        }

        const query:BookQuery = {
            title: title,
            author: author,
            publisher: publisher,
            language_id: lang_id,
            genres: []
        }
        let response = await fetch("http://localhost:8080/findBook",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(query)
            }
        )
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        });
        if (response != null) {
            setBooks(response)
            console.log(response)
        }
    }

    async function fetchTableData() {
        let response = await fetch("http://localhost:8080/fetchBrowseTables", {
            method: 'GET'
        })
        .then(res => {
            if (res.ok) {
                console.log("tables fetched");
                return res.json();
            }
        });
        return response
    }

    useEffect(() => {
        const mog = async () => {
            if (tables === null) {
                let resp_tables = await fetchTableData();
                setTables(resp_tables);
            }
        }
        mog();
    })

    function populateLangList() {
        if (tables === null) {
            return <></>
        }
        else {
            return tables.languages.map((item) => (
                <option key={item.lang_id} value={item.language}></option>
            ))
        }
    }

    return (
        <div className='Browse-Container'>
            <div className='Browse-Filter-Container'>
                <div>
                    <p>Title: </p>
                    <input type="text" onChange={(e) => {setTitle(e.target.value)}}></input>
                </div>
                <div>
                    <p>Author: </p>
                    <input type="text" onChange={(e) => {setAuthor(e.target.value)}}></input>
                </div>
                <div>
                    <p>Language: </p>
                    <input list="language_options" type="datalist" onChange={(e) => {setLang(e.target.value)}}></input>
                    <datalist id="language_options">
                        {populateLangList()}
                    </datalist>
                </div>
                <div>
                    <p>Genres: </p>
                    <input type="text"></input>
                </div>
                <div>
                    <button onClick={fetchBookData}> Apply Filters </button>
                </div>
            </div>
            <div className='Browse-Result-Container'>
                <div className='Result-Page-Nav'>page 1 of 3</div>
                <div className='Result-Page-Container'>
                    {books.map((item) => (
                        <BookCard key={item.book_id} data={item} setDataCardInfo={null} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Browse;