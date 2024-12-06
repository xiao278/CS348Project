import React, { useEffect, useState } from 'react';
import "./BrowseBook.css"
import { Credentials, BrowseTables } from "../../GeneralIntefaces";
import { BookQuery, BookInfoRequest, BorrowRequest } from "../../../../library-server/request_type";
import { BorrowStatus } from "../../../../library-server/query_books"
import Select from 'react-select';

interface BookData extends Object {
    book_id: number;
    title: string;
    Publisher: {name: string};
    publish_date: string;
    Language: any;
    Authors: {name: string}[];
    Genres: {genre: string}[];
}

interface BookInfoData {
    copy_id: number;
    status: string;
}

interface Genres {
    genre_id: number; //LIKE "%"
    genre: string;
}

interface BookCardProps {
    data: BookData;
    setShowCard: any;
    setBook: any;
}

interface BrowseProps {
    // credentials: Credentials
    tables: BrowseTables | null;
    setTables: any
}

interface InfoCardProps {
    book: BookData;
    showCard: boolean;
    setShowCard: any;
}

function BookCard(props: BookCardProps) {
    const data = props.data
    
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

    function handleMoreInfo() {
        props.setBook(props.data);
        props.setShowCard(true);
    }

    async function borrowBook() {
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
        let response: BorrowStatus | void = await fetch("http://localhost:8080/checkoutBook",
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
            if (response.success) {
                alert("CHECKOUT SUCCESSFUL")
            }
            else {
                alert(`CHECKOUT FAILURE: ${response.message}`)
            }
        }
    }

    return (
        <div className='Book-Card-Container'>
            <div className='Info-Container'>
                <div>Title: {data.title}</div>
                <div>Author(s): {extractAuthorNames(data.Authors)}</div>
                <div>Publisher: {data.Publisher === null ? "N/A": data.Publisher.name}</div>
                <div>Publish Date: {data.publish_date === null ? "N/A": data.publish_date}</div>
                <div>Language: {data.Language === null ? "N/A" : data.Language.language}</div>
                {/* <div>Date: {data.}</div> */}
                <div>Genre(s): {extractGenres(data.Genres)}</div>
            </div>
            <div className='Buttons-Container'>
                <button className='More-Button Common-Button' onClick={handleMoreInfo}>More Info</button>
                <button className='Bookmark-Button Common-Button'onClick={borrowBook}>Checkout</button>
            </div>
        </div>
    )
}

function InfoCard(props: InfoCardProps) {
    const [ bookInfo, setBookInfo ] = useState<BookInfoData[]>();

    const query: BookInfoRequest = {
        book_id: props.book.book_id,
    }

    // fetch function
    async function fetchBookInfo() {
        let response = await fetch("http://localhost:8080/getBookInfo",
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
        setBookInfo(response);
    }

    useEffect(() => {
        fetchBookInfo()
    });

    /* [{"copy_id":1,"status":"borrowed"}] */

    function availTable(data:BookInfoData[]) {
        return (
          <table className='Info-Table' border={1}>
            <thead>
              <tr>
                <th>Copy ID</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.copy_id}>
                  <td>{item.copy_id}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
    }

    return (
        <div className='Book-Info-Popout'>
            <div>
                <button className='Common-Button' onClick={()=>{props.setShowCard(false)}}>x</button>
                <div>viewing more information for <span style={{
                    backgroundColor: "yellow",
                    padding: "2px",
                    borderRadius: "3px"
                }}>{props.book.title}</span></div>
            </div>
            <div>
                <h1>Availability</h1>
                {bookInfo !== undefined ? availTable(bookInfo) : "N/A"}
            </div>
            
        </div>
    )
}

function Browse(props: BrowseProps) {
    const page_items = 15;
    const tables = props.tables;
    const setTables = props.setTables;

    const [ books, setBooks ] = useState<BookData[]>([]);
    const [ langOpt, setLangOpt ] = useState<BrowseTables['languages'][number] | null>({lang_id: 0, language: "Any"});
    const [ title, setTitle ] = useState("");
    const [ author, setAuthor ] = useState("");
    const [ publisher, setPublisher ] = useState("");
    const [ incGenres, setIncGenres ] = useState<Genres[]>([]);
    const [ excGenres, setExcGenres ] = useState<Genres[]>([]);

    
    const [ curFilters, setCurFilters ] = useState<BookQuery | null>(null)
    const [ curPage, setCurPage ] = useState(1)
    const [ queryStats, setQueryStats ] = useState<any>({num_books: 0, num_pages: 0})
    const [ showCard, setShowCard ] = useState<boolean>(false)
    const [ selectedBook, setSelectedBook ] = useState<BookData>()

    function extractGenreIds(input_list:Genres[]) {
        let output_list:number[] = [];
        input_list.map((item) => {output_list.push(item.genre_id)});
        return output_list;
    }

    async function fetchBookData(page) {
        const query:BookQuery = {
            title: title,
            author: author,
            publisher: publisher,
            language_id: langOpt === null ? 0 : langOpt.lang_id,
            include_genre_ids: extractGenreIds(incGenres),
            exclude_genre_ids: extractGenreIds(excGenres),
        }
        
        const findBookReq = {
            query: query,
            page: page
        }

        //fetch pages
        if (curFilters === null || JSON.stringify(curFilters) !== JSON.stringify(query)){
            // console.log("fetching new query stats")
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

        // console.log(findBookReq)
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

    function calc_books_displayed() {
        let lowerBound = Math.min((curPage - 1) * page_items + 1, queryStats.num_books)
        let upperBound = Math.min((curPage) * page_items, queryStats.num_books)
        return `${lowerBound}-${upperBound}`;
    }

    const selectStyles = {
        menuList: styles => {
          return {
            ...styles,
            maxHeight: 150,
            overflow: "hidden"
          };
        },
        control: (provided, state) => ({
            ...provided,
            background: '#fff',
            borderColor: '#9e9e9e',
            minHeight: '100%',
            height: '0px',
            boxShadow: state.isFocused ? null : null,
            borderRadius: '3px'
        }),
        valueContainer: (provided, state) => ({
            ...provided,
            height: '0px',
            minHeight: '100%',
            padding: '0',
        }),
        input: (provided, state) => ({
            ...provided,
            margin: '0px',
        }),
        indicatorSeparator: state => ({
            display: 'none',
        }),
        indicatorsContainer: (provided, state) => ({
            ...provided,
            height: '0px',
            minHeight: '100%'
        }),
    };

    return (
        <div className='Browse-Container'>
            <div className='Browse-Filter-Container'>
                <div>
                    <p>Title: </p>
                    <div className='Input-Field'>
                        <input type="text" onChange={(e) => {setTitle(e.target.value)}}></input>
                    </div>
                </div>
                <div>
                    <p>Author: </p>
                    <div className='Input-Field'>
                        <input type="text" onChange={(e) => {setAuthor(e.target.value)}}></input>
                    </div>
                </div>
                <div>
                    <p>Publisher: </p>
                    <div className='Input-Field'>
                        <input type="text" onChange={(e) => {setPublisher(e.target.value)}}></input>
                    </div>
                </div>
                <div>
                    <p>Language: </p>
                    <Select 
                        className='Input-Field'
                        value={langOpt}
                        onChange={(option) => {setLangOpt(option)}}
                        options={tables === null ? [{lang_id: 0, language: "Any"}] : tables.languages.concat({lang_id: 0, language: "Any"})}
                        placeholder="Search Languages..."
                        getOptionLabel={(option) => option.language}
                        getOptionValue={(option) => option.lang_id.toString()}
                        styles={selectStyles}
                    ></Select>
                </div>
                <div className='Genre-Container'>
                    <p>Include Genres: </p>
                    <Select 
                        isMulti
                        options={tables === null ? [] : tables.genres}
                        getOptionLabel={(option) => option.genre}
                        getOptionValue={(option) => option.genre_id.toString()}
                        onChange={(options) => setIncGenres(options as Genres[])}
                    ></Select>
                </div>
                <div className='Genre-Container'>
                    <p>Exclude Genres: (not working)</p>
                    <Select 
                        isMulti
                        options={tables === null ? [] : tables.genres}
                        getOptionLabel={(option) => option.genre}
                        getOptionValue={(option) => option.genre_id.toString()}
                    ></Select>
                </div>
                <div>
                    <button onClick={() => {setCurPage(1); fetchBookData(1)}} className='Common-Button'> Apply Filters </button>
                </div>
            </div>
            <div className='Browse-Result-Container'>
                {showCard && (selectedBook !== undefined) ? <InfoCard book={selectedBook} showCard={showCard} setShowCard={setShowCard} /> : <></>}
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
                        <BookCard key={item.book_id} data={item} setBook={setSelectedBook} setShowCard={setShowCard}/>
                    ))}
                </div>
            </div>
        </div>
    );
}

export {BookData};
export default Browse;