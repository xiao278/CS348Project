import React, { PureComponent, useEffect, useState } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import "./Statistics.css"

interface StatisticsProps {

}

interface LibStatsData {
    genre_books: {
        genre: string;
        book_count: number;
    }[];
    copy_status: {
        status: string;
        status_count: number;
    }[];
    genre_similarity: any[];
}

function DynamicTable({data}) {
    return (
        <div>
            <table border={1} style={{borderCollapse: "collapse"}}>
                <thead>
                    <tr>
                        {Object.entries(data[0]).map((item) => 
                            <th>{item[0]}</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => 
                        <tr>
                            {Object.entries(row).map((item) => 
                                <td>{`${item[1]}`}</td>
                            )}
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

function Statistics(props: StatisticsProps) {
    const [ libStats, setLibStats ] = useState<LibStatsData>();

    async function fetchStats() {
        let response = await fetch("http://localhost:8080/fetchStats", {
            method: 'GET'
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            }
        });
        setLibStats(response)
    }

    useEffect(() => {
        fetchStats()
        console.log("fetched stats")
    },[])

    function sumCopies() {
        let counter = 0;
        libStats?.copy_status.map(item => {
            counter += item.status_count;
        })
        return counter
    }

    function GraphGenreBooks() {
        console.log(libStats?.genre_books)
        return (
            <div style={{width: "100%", height: "700px"}}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={libStats?.genre_books} layout='vertical' margin={{left: 50, right: 50}}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <YAxis dataKey="genre" type="category" tick={{fill: "white"}}/>
                        <XAxis type="number" tick={{fill: "white"}}/>
                        <Tooltip contentStyle={{color: "#25283D"}} />
                        <Legend />
                        <Bar dataKey="book_count" fill="#8884d8"/>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        )
    }

    return (
        <div className="StatPageContainer">
            <div>
                <h1>Status of copies (total {libStats === undefined ? "N/A" : `${sumCopies()}`})</h1>
                {libStats === undefined ? "N/A" : <DynamicTable data={libStats.copy_status} />}
            </div>
            <div>
                <h1>Genres with the most books</h1>
                {libStats === undefined ? "N/A" : <GraphGenreBooks />}
            </div>
        </div>
    )
}

export { LibStatsData }
export default Statistics