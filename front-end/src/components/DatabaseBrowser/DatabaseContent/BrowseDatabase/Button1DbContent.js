import React from 'react';
import DbTable from './DbTable';
import ResizableWrapper from './Resizeable';

function Button1DbContent({ data }) {
    return (
        <ResizableWrapper>
            <div style={{ maxHeight: '48vh', overflow: 'auto' }}>
                <h2>DbContent</h2>
                <button onClick={() => console.log(data)}>Click me</button>
                <DbTable data={data} />
            </div>
        </ResizableWrapper>
    );
}

export default Button1DbContent;