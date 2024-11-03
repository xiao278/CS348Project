import React from 'react';
import "./BrowseBook.css"

function Browse() {
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
                    <p>Edition: </p>
                    <input type="text"></input>
                </div>
            </div>
            <div className='Browse-Result-Container'>results</div>
        </div>
    );
}

export default Browse;