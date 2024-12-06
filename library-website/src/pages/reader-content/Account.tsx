import React from 'react';

interface AccountProps {
    setPage: any;
}

function Account(props: AccountProps) {

    function handleLogOut() {
        sessionStorage.clear()
        props.setPage("login")
    }

    return (
        <div>
            <div>User: {sessionStorage.getItem("username")}</div>
            <button className="Common-Button" onClick={handleLogOut}>Log out</button>
        </div>
    )
}

export default Account