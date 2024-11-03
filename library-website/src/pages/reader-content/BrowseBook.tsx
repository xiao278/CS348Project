import React from 'react';
import "./BrowseBook.css"
import { Credentials } from "../../GeneralIntefaces";

interface BookData {
    book_id: number;
    title: string;
    publisher: string;
    language: string;
    authors: string[];
    genres: string[];
}

interface BookCardProps {
    data: BookData;
    setDataCardInfo: any;
}

interface BrowseProps {
    credentials: Credentials
}

function BookCard(props: BookCardProps) {
    const data = props.data
    const setDataCardInfo = props.setDataCardInfo
    return (
        <div className='Book-Card-Container'>
            <div className='Info-Container'>
                <div>Title: {data.title}</div>
                <div>Author(s): {data.authors.toString()}</div>
                <div>Published By: {data.publisher}</div>
                <div>Language: {data.language}</div>
                <div>Genre(s): {data.genres.toString()}</div>
            </div>
            <div className='Buttons-Container'>
                <button className='More-Button'>More</button>
                <button className='Bookmark-Button'>Bookmark</button>
            </div>
        </div>
    )
}

function Browse(props: BrowseProps) {

    async function fetchBookData(filters) {
        let response = await fetch("http://localhost:8080/findBook",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({})
            }
        )
        .then(response => {
            return response.json();
        });
        return response;
    }

    let dummyData: BookData[] = [
        {book_id:1, title:"frog", publisher:"little house", language: "english", authors:["mog", "dog"], genres:["test1", "g2", "g3"]},
        {book_id:2, title:"superlongtitle lorem ipsum dolor sit amet jjfkdjafklsdjfldskjfoaejfpajjdslfkj djfklds jafklsdjkfldsjafjsdfjsdl fjdskl fjdsklfj dsalk jj END", 
            publisher:"lorem ipsum", language: "english", authors:["mog", "dog"], genres:["test1", "g2", "g3"]},
        {book_id:3, title:"frog", publisher:"little house", language: "english", authors:["mog", "dog"], genres:["test1", "g2", "g3"]},
        {book_id:4, title:"frog", publisher:"little house", language: "english", authors:["mog", "dog"], genres:["test1", "g2", "g3"]},
        {book_id:5, title:"frog", publisher:"little house", language: "english", authors:["mog", "dog"], genres:["test1", "g2", "g3"]},
        {book_id:6, title:"frog", publisher:"little house", language: "english", authors:["mog", "dog"], genres:["test1", "g2", "g3"]},
    ]
    return (
        <div className='Browse-Container'>
            <div className='Browse-Filter-Container'>
                <div>
                    <p>Title: </p>
                    <input type="text"></input>
                </div>
                <div>
                    <p>Author: </p>
                    <input type="text"></input>
                </div>
                <div>
                    <p>Language: </p>
                    <input type="text"></input>
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
                    {dummyData.map((item) => (
                        <BookCard key={item.book_id} data={item} setDataCardInfo={null} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Browse;