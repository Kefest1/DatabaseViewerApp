import React from 'react';
import DbTable from './DbTable';
import ResizableWrapper from './Resizeable';

function Button1DbContent({ data, fetchTime, tableName, databaseName, selectedColumns }) {
    return (
        <ResizableWrapper>
            <div style={{ maxHeight: '57vh', overflow: 'auto' }}>
                <h2>Content for {tableName} table:</h2>
                {/*<button onClick={() => console.log(data)}>Click me</button>*/}
                <DbTable data={data} tableName={tableName} databaseName={databaseName} selectedColumns={selectedColumns} />
                <h2>Fetched {data.length} rows in: {fetchTime}</h2>
                {/*(data.length == 1) && <h2>Fetched {data.length} row in: {fetchTime}</h2>*/}
                {/*(data.length == 0) && <h2>Table seems to be empty</h2>*/}
            </div>
        </ResizableWrapper>
    );
}

export default Button1DbContent;
