import { getCookie, isCookie } from "../getCookie";
import React, { useState, useEffect } from "react";

async function fetchData(userName) {
    const tables = await fetch("http://localhost:8080/api/ownershipdetails/getallavailabletables/" + userName);
    const availableTables = await tables.json();
    return availableTables;
}

function MainPage() {
    const userName = getCookie('userName');
    const [tablesData, setTablesData] = useState([]);

    useEffect(() => {
        fetchData(userName)
            .then((data) => {
                setTablesData(data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, [userName]);

    console.log(tablesData);

    if (userName !== null) {
        return (
            <div style={{textAlign: 'left'}}>
                <div>
                    <label>Available tables for user {userName}:</label>
                </div>
                <div>
                    <table className="table">
                        <tbody>
                        {tablesData.map((row, index) => (
                            <tr key={index}>
                                <td>{index.valueOf() + 1.} {row.valueOf()}</td>
                                {/*<td>{row.valueOf()}</td>*/}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
    else {
        window.location.href = 'http://localhost:3000/login'
    }

}

export default MainPage;
