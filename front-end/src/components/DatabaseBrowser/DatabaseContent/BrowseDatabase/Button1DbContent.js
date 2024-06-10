import React from 'react';
import DbTable from './DbTable';
import Resizable from './Resizeable';

function Button1DbContent({ data }) {
    return (
        <Resizable initialHeight={300}>
            <div>
                <h2>DbContent</h2>
                <button onClick={() => console.log(data)}>Click me</button>
                <DbTable data={data} />
            </div>
        </Resizable>
    );
}

export default Button1DbContent;