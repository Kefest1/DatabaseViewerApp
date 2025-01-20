import {
    addEdge,
    Background,
    Edge,
    Panel,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState
} from "@xyflow/react";
import {DatabaseSchemaNode} from "../components/database-schema-node";
import React, {useEffect, useState} from "react";
import Select from "@mui/material/Select";
import {MenuItem, Paper} from "@mui/material";
import {getCookie} from "../../../getCookie";
import Button from "@mui/material/Button";

const defaultNodes = [
    {
        id: "1",
        position: { x: 0, y: 0 },
        type: "databaseSchema",
        data: {
            label: "Products",
            schema: [
                { title: "id", type: "uuid" },
                { title: "name", type: "varchar" },
                { title: "description", type: "varchar" },
                { title: "warehouse_id", type: "uuid" },
                { title: "supplier_id", type: "uuid" },
                { title: "price", type: "money" },
                { title: "quantity", type: "int4" },
            ],
        },
    },
    {
        id: "2",
        position: { x: 350, y: -100 },
        type: "databaseSchema",
        data: {
            label: "Warehouses",
            schema: [
                { title: "id", type: "uuid" },
                { title: "name", type: "varchar" },
                { title: "address", type: "varchar" },
                { title: "capacity", type: "int4" },
            ],
        },
    },
    {
        id: "3",
        position: { x: 350, y: 200 },
        type: "databaseSchema",
        data: {
            label: "Suppliers",
            schema: [
                { title: "id", type: "uuid" },
                { title: "name", type: "varchar" },
                { title: "description", type: "varchar" },
                { title: "country", type: "varchar" },
            ],
        },
    },
];

const defaultEdges: Edge[] = [];

const nodeTypes = {
    databaseSchema: DatabaseSchemaNode,
};

async function fetchAvailableDatabases(userName) {
    const tables = await fetch("http://localhost:8080/api/databaseinfo/getAvailableDatabaseNames/" + userName);
    return await tables.json();
}

async function fetchAvailableTables(selectedDatabase) {
    const userName = getCookie("userName");
    const url = "http://localhost:8080/api/tableinfo/getAvailableTables/" + userName + "/" + selectedDatabase;
    const tables = await fetch(url);
    return await tables.json();
}

async function fetchStructure(databaseName, selectedTable) {
    const userName = getCookie("userName");
    const response = await fetch(
        `http://localhost:8080/api/tableinfo/getTableStructure/${userName}/${databaseName}/${selectedTable}`
    );
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
}

async function fetchConnection(databaseName, selectedTableOne, selectedTableMany) {
    const userName = getCookie("userName");
    try {
        console.log(`http://localhost:8080/api/tableconnection/getConnectionDetails/${databaseName}/${selectedTableOne}/${selectedTableMany}/${userName}`);
        const response = await fetch(
            `http://localhost:8080/api/tableconnection/getConnectionDetails/${databaseName}/${selectedTableOne}/${selectedTableMany}/${userName}`
        );

        if (!response.ok) {
            throw new Error(`Network error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data === null) {
            throw new Error('The response data is null.');
        }

        return data;
    } catch (error) {
        console.log('Empty message:');
        return null; // Return null or a default value to handle this case gracefully
    }
}

function prepareNodes(tableOne, tableMany, tableNameOne, tableNameMany) {
    const nodes = [];

    const tableOneNode = {
        id: "1",
        position: { x: 0, y: 0 },
        type: "databaseSchema",
        data: {
            label: tableNameOne,
            schema: tableOne.map(column => ({
                title: column.columnName,
                type: column.columnType.toLowerCase()
            })),
        },
    };

    const tableManyNode = {
        id: "2",
        position: { x: 350, y: 0 },
        type: "databaseSchema",
        data: {
            label: tableNameMany,
            schema: tableMany.map(column => ({
                title: column.columnName,
                type: column.columnType.toLowerCase()
            })),
        },
    };

    nodes.push(tableOneNode);
    nodes.push(tableManyNode);

    return nodes;
}

function ConnectionsCreator() {
    const userName = getCookie("userName");

    const [availableDatabases, setAvailableDatabases] = useState([]);
    const [selectedDatabase, setSelectedDatabase] = useState("");

    const [availableTables, setAvailableTables] = useState([]);

    const [selectedTableOne, setSelectedTableOne] = useState("");
    const [selectedTableMany, setSelectedTableMany] = useState("");

    const [filteredTables, setFilteredTables] = useState([]);

    const [tableOneContent, setTableOneContent] = useState([]);
    const [tableManyContent, setTableManyContent] = useState([]);

    const [initialConnection, setInitialConnection] = useState([]);
    const [isEdgesSet, setIsEdgesSet] = useState(false);

    const [connectionID, setConnectionID] = useState(-1);

    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    useEffect(() => {
        fetchAvailableDatabases(userName)
            .then(data => {
                setAvailableDatabases(data);
            });
    }, [userName]);

    useEffect(() => {
        const loadTables = async () => {
            if (selectedDatabase) {
                const tables = await fetchAvailableTables(selectedDatabase);
                setAvailableTables(tables);
            } else {
                setAvailableTables([]);
            }
        };

        loadTables();
    }, [selectedDatabase]);

    useEffect(() => {
        if (selectedTableOne !== "") {
            console.log(selectedTableOne);
            const filtered = availableTables.filter(table => table !== selectedTableOne);
            setFilteredTables(filtered);
        }

    }, [selectedTableOne]);

    useEffect(() => {
        if (selectedTableOne !== "") {
            console.log(selectedTableOne);
            const filtered = availableTables.filter(table => table !== selectedTableOne);
            setFilteredTables(filtered);
        }

    }, [selectedTableOne]);

    useEffect(() => {
        if (selectedTableMany !== "" && selectedTableOne !== "") {
            fetchStructure(selectedDatabase, selectedTableOne)
                .then(data => {
                    console.log(data);
                    setTableOneContent(data);
                });
            fetchStructure(selectedDatabase, selectedTableMany)
                .then(data => {
                    console.log(data);
                    setTableManyContent(data);
                });
        }
    }, [selectedTableOne, selectedTableMany]);

    useEffect(() => {
        if (tableOneContent.length > 0 && tableManyContent.length > 0) {
            const newNodes = prepareNodes(tableOneContent, tableManyContent, selectedTableOne, selectedTableMany);
            setNodes(newNodes);
        }
    }, [tableOneContent, tableManyContent]);

    useEffect(() => {
        setSelectedTableOne("");
        setSelectedTableMany("");

    }, [selectedDatabase]);

    useEffect(() => {
        if (selectedDatabase !== "" && selectedTableOne !== "" && selectedTableMany !== "") {
            fetchConnection(selectedDatabase, selectedTableOne, selectedTableMany)
                .then(data => {
                    if (data === null) {
                        setConnectionID(-1);
                        setIsEdgesSet(true);
                    }
                    else {
                        setInitialConnection(data);
                        console.log(data);
                        setConnectionID(data.id);
                        const edge = [
                            {
                                id: "e1-2",
                                source: "1",
                                target: "2",
                                sourceHandle: data.manyColumnName,
                                targetHandle: data.oneColumnName,
                            }
                        ];
                        setEdges(edge);
                    }
                });
        }
    }, [selectedDatabase, selectedTableOne, selectedTableMany]);


    useEffect(() => {
        if (edges.length > 0) {
            setIsEdgesSet(true);
            console.log("Edges have been updated:", edges);
        }
    }, [edges]);

    return (
        <Paper sx={{ width: 'calc(80vw)', height: 'calc(86vh)', overflow: 'auto' }} elevation={3} style={{ padding: '10px', margin: '10px', borderRadius: '8px' }}>
                <Select
                    labelId="demo-simple-select-database"
                    id="demo-simple-database"
                    value={selectedDatabase}
                    label="Select Database"
                    onChange={(event) => setSelectedDatabase(event.target.value)}
                    variant={"outlined"}
                >
                    {availableDatabases.map((option, index) => (
                        <MenuItem key={index} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>

                {selectedDatabase && (
                    <Select
                        labelId="demo-simple-select-table-one"
                        id="demo-simple-table-one"
                        value={selectedTableOne}
                        label="Select First Table"
                        onChange={(event) => setSelectedTableOne(event.target.value)}
                        variant={"outlined"}
                    >
                        {availableTables.map((option, index) => (
                            <MenuItem key={index} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                )}

                {selectedDatabase && selectedTableOne && (
                    <Select
                        labelId="demo-simple-select-table-many"
                        id="demo-simple-table-many"
                        value={selectedTableMany}
                        label="Select Second Table"
                        onChange={(event) => setSelectedTableMany(event.target.value)}
                        variant={"outlined"}
                    >
                        {filteredTables.map((option, index) => (
                            <MenuItem key={index} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                )}

                {
                    selectedDatabase !== "" && selectedTableOne !== "" && setSelectedTableMany !== "" && isEdgesSet === true && (
                        <ReactFlowProvider>
                            <LayoutFlow selectedDatabase={selectedDatabase} initialNodes={nodes} initialEdges={edges} selectedTableOne={selectedTableOne} selectedTableMany={selectedTableMany} id={connectionID}/>
                        </ReactFlowProvider>
                    )
                }
        </Paper>
    );

}

const LayoutFlow = ({ selectedDatabase, initialNodes, initialEdges, selectedTableOne, selectedTableMany, id }) => {
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

    const onConnect = (params) => {
        const sourceNode = nodes.find(node => node.id === params.source);
        const targetNode = nodes.find(node => node.id === params.target);

        if (sourceNode && targetNode) {
            const sourceColumn = params.sourceHandle;
            const targetColumn = params.targetHandle;

            const sourceColumnDataType = sourceNode.data.schema.find(column => column.title === sourceColumn).type;
            const targetColumnDataType = targetNode.data.schema.find(column => column.title === targetColumn).type;

            if ((sourceColumnDataType === 'long' || sourceColumnDataType === 'integer') &&
                (targetColumnDataType === 'long' || targetColumnDataType === 'integer')) {

                setEdges([]);

                setEdges((eds) => addEdge(params, eds));
                console.log(`Connection made from ${sourceNode.data.label}.${sourceColumn} to ${targetNode.data.label}.${targetColumn}`);
            }
        }

    };
    const handleEdgesChange = (changes) => {
        setEdges([]);
    };

    async function addEdges() {
        console.log(edges);
        console.log(nodes);
        console.log(id);
        if (id < 0) {
            const payload = {
                oneTableName: selectedTableOne,
                manyTableName: selectedTableMany,
                oneColumnName: edges[0].sourceHandle,
                manyColumnName: edges[0].targetHandle,
            }

            try {
                const response = await fetch(`http://localhost:8080/api/tableconnection/addconnection`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    const message = await response.text();
                    console.log("Success:", message);
                } else {
                    const errorMessage = await response.text();
                    console.error("Error:", errorMessage);
                }
            } catch (error) {
                console.error("Network error:", error);
            }
        }
        else {
            if (edges.length === 0) {
                try {
                    const response = await fetch(`http://localhost:8080/api/tableconnection/delete/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        const message = await response.text();
                        console.log("Success:", message);
                    } else {
                        const errorMessage = await response.text();
                        console.error("Error:", errorMessage);
                    }
                } catch (error) {
                    console.error("Network error:", error);
                }
            }
            else {
                const userName = getCookie("userName");
                const updatedTableConnection = {
                    oneTableName: selectedTableOne,
                    manyTableName: selectedTableMany,
                    oneColumnName: edges[0].sourceHandle,
                    manyColumnName: edges[0].targetHandle,
                };

                try {
                    const response = await fetch(`http://localhost:8080/api/tableconnection/update/${id}/${userName}/${selectedDatabase}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updatedTableConnection),
                    });

                    if (response.ok) {
                        const message = await response.text();
                        console.log("Success:", message);
                    } else {
                        const errorMessage = await response.text();
                        console.error("Error:", errorMessage);
                    }
                } catch (error) {
                    console.error("Network error:", error);
                }
            }
        }
    }

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={handleEdgesChange}
            fitView
            onConnect={onConnect}
            nodeTypes={nodeTypes}
        >
            <Panel position="top-left">
                <h4 style={{ marginBottom: '10px' }}>Selected database: {selectedDatabase}</h4>
                <Button onClick={addEdges} variant={"contained"} color={"primary"}>
                    Commit changes
                </Button>
            </Panel>
            <Background />
        </ReactFlow>
    );
};


export default ConnectionsCreator;
