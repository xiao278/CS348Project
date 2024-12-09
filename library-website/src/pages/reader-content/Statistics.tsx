import React, { useEffect, useState } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StatisticsProps {

}

interface LibStatsData {
    genre_book: {
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
            <table border={1}>
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

    return (
        <div>
            <div>
                <h1>Status of copies (total {libStats === undefined ? "N/A" : `${sumCopies()}`})</h1>
                {libStats === undefined ? "N/A" : <DynamicTable data={libStats.copy_status} />}
            </div>
        </div>
    )
}

export { LibStatsData }
export default Statistics