import React from "react";
import DatabaseCreator from "./DatabaseCreator";
import TableCreator from "./TableCreator";
import DatabaseModifier from "./DatabaseModifier";
import TableModifier from "./TableModifier";
import DatabaseRemove from "./DatabaseRemove";

function StructureModifier() {

    return (
        <div>
            <h6>Structure modifier</h6>
            <DatabaseCreator/>

            <h6>Table create</h6>
            <TableCreator/>

            <h6>Modify database structure</h6>
            <DatabaseModifier/>

            <h6>Modify table structure</h6>
            <TableModifier/>

            <h6>Delete database structure</h6>
            <DatabaseRemove/>
        </div>
    )
}

export default StructureModifier;
