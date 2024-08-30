import React from 'react';
import DbTable from './DbTable';
import ResizableWrapper from './Resizeable';

function Button1DbContent({ data, fetchTime }) {
    return (
        <ResizableWrapper>
            <div style={{ maxHeight: '57vh', overflow: 'auto' }}>
                <h2>DbContent</h2>
                {/*<button onClick={() => console.log(data)}>Click me</button>*/}
                <DbTable data={data} />
                (data.length > 1) && <h2>Fetched {data.length} rows in: {fetchTime}</h2>
                (data.length == 1) && <h2>Fetched {data.length} row in: {fetchTime}</h2>
                (data.length == 0) && <h2>Table seems to be empty</h2>
            </div>
        </ResizableWrapper>
    );
}

export default Button1DbContent;
