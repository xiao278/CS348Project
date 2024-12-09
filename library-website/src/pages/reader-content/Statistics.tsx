import React from 'react';

interface StatisticsProps {

}

function Statistics(props: StatisticsProps) {

    return (
        <div>
            <div>User: {sessionStorage.getItem("username")}</div>
        </div>
    )
}

export default Statistics