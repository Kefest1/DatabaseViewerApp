import React from "react";
import DatabaseCreator from "./DatabaseCreator";
import TableCreator from "./TableCreator";
import DatabaseModifier from "./DatabaseModifier";
import TableModifier from "./TableModifier";
import DatabaseRemove from "./DatabaseRemove";
import {Paper} from "@mui/material";

function StructureModifier() {

    return (
        <Paper sx={{ width: 'calc(80vw)', height: 'calc(86vh)', overflow: 'auto' }} elevation={3} style={{ padding: '10px', margin: '10px', borderRadius: '8px' }}>

        <div>
            <h5 style={{
                fontSize: '1.5rem',
                color: '#333',
                marginBottom: '15px',
                fontFamily: 'Arial, sans-serif',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
                letterSpacing: '0.5px',
                padding: '10px 0',
                borderBottom: '2px solid #2A70C6FF',
                backgroundColor: '#f9f9f9',
                borderRadius: '4px',
                textAlign: 'center',
            }}>
                Structure modifier
            </h5>

            <DatabaseCreator/>
            <br/>

            <h6>Table create</h6>
            <TableCreator/>
            <br/>

            <h6>Modify database structure</h6>
            <DatabaseModifier/>
            <br/>

            <h6>Modify table structure</h6>
            <TableModifier/>
            <br/>

            <h6>Delete database structure</h6>
            <DatabaseRemove/>
        </div>
        </Paper>
    )
}

export default StructureModifier;
