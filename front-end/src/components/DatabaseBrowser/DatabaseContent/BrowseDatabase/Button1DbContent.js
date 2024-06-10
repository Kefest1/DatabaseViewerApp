import React from 'react';

function Button1DbContent({ data }) {
    return (
        <div>
            <h2>DbContent</h2>
            <button onClick={() => console.log(data)}>Click me</button>
        </div>
    );
}

export default Button1DbContent;