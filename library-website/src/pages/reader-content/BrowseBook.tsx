import React, { useEffect, useState } from 'react';
import "./BrowseBook.css"
import { Credentials, BrowseTables } from "../../GeneralIntefaces";
import { BookQuery } from "../../../../library-server/request_type";

interface BookData extends Object {
    book_id: number;
    title: string;
    Publisher: {name: string};
    Language: any;
    Authors: {name: string}[];
    Genres: {genre: string}[];
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
    const setDataCardInfo = props.setDataCardInfo
    
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
    
    return (
        <div className='Book-Card-Container'>
            <div className='Info-Container'>
                <div>Title: {data.title}</div>
                <div>Author(s): {extractAuthorNames(data.Authors)}</div>
                <div>Publisher: {data.Publisher === null ? "N/A": data.Publisher.name}</div>
                <div>Language: {data.Language === null ? "N/A" : data.Language.language}</div>
                <div>Genre(s): {extractGenres(data.Genres)}</div>
            </div>
            <div className='Buttons-Container'>
                <button className='More-Button'>More</button>
                <button className='Bookmark-Button'>Bookmark</button>
            </div>
        </div>
    )
}

function Browse(props: BrowseProps) {
    const page_items = 15;
    const tables = props.tables;
    const setTables = props.setTables;

    const [ books, setBooks ] = useState<BookData[]>([]);
    const [ lang, setLang ] = useState("");
    const [ title, setTitle ] = useState("");
    const [ author, setAuthor ] = useState("");
    const [ publisher, setPublisher ] = useState("");
    const [ genres, setGenres ] = useState([])
    
    const [ curFilters, setCurFilters ] = useState<BookQuery | null>(null)
    const [ curPage, setCurPage ] = useState(1)
    const [ queryStats, setQueryStats ] = useState<any>({num_books: 0, num_pages: 0})

    async function fetchBookData(page) {
        // match lang text with id, not the best way
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
            genres: genres
        }
        
        const findBookReq = {
            query: query,
            page: page
        }

        //fetch pages
        if (curFilters === null || JSON.stringify(curFilters) != JSON.stringify(query)){
            console.log("fetching new query stats")
            setCurPage(1)
            setQueryStats({num_books: 0, num_pages: 0})
            let response = await fetch("http://localhost:8080/countBooks",
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
            if (response != null) {
                setQueryStats(response)
                // console.log(response);
            }
        }

        console.log(findBookReq)
        let response = await fetch("http://localhost:8080/findBooks",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(findBookReq)
            }
        )
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                setBooks([]);
                setCurPage(1);
                setQueryStats({num_books: 0, num_pages: 0});
            }
        });
        if (response != null) {
            setBooks(response);
            setCurFilters(query);
            // console.log(response);
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
    });

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

    function calc_books_displayed() {
        let lowerBound = Math.min((curPage - 1) * page_items + 1, queryStats.num_books)
        let upperBound = Math.min((curPage) * page_items, queryStats.num_books)
        return `${lowerBound}-${upperBound}`;
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
                    <p>Publisher: </p>
                    <input type="text" onChange={(e) => {setPublisher(e.target.value)}}></input>
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
                    <button onClick={() => {setCurPage(1); fetchBookData(1)}} className='Common-Button'> Apply Filters </button>
                </div>
            </div>
            <div className='Browse-Result-Container'>
                <div className='Result-Page-Bar'>
                    <div className='Result-Page-Stats'>
                        Book(s) Found: {queryStats.num_books}. Displaying results {calc_books_displayed()}
                    </div>
                    <div className='Result-Page-Nav'>
                        
                        {curPage > 1 ? <button className='Common-Button' onClick={() => {fetchBookData(1); setCurPage(1);}}>First</button> : <button className='No-Button'>First</button>}
                        {curPage > 1 ? <button className='Common-Button' onClick={() => {fetchBookData(curPage - 1); setCurPage(curPage - 1);}}>Prev</button> : <button className='No-Button'>Prev</button>}
                        <div className='Page-Display'>Page {curPage} of {
                            queryStats === null ? 1 : queryStats.num_pages
                        }</div>
                        {curPage < queryStats.num_pages ? <button className='Common-Button' onClick={() => {fetchBookData(curPage + 1); setCurPage(curPage + 1)}}>Next</button> : <button className='No-Button'>Next</button>}
                        {curPage < queryStats.num_pages ? <button className='Common-Button' onClick={() => {fetchBookData(queryStats.num_pages); setCurPage(queryStats.num_pages)}}>Last</button> : <button className='No-Button'>Last</button>}
                    </div>
                </div>
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