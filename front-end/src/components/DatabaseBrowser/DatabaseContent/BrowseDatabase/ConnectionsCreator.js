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
import {IconButton, MenuItem, Paper, SnackbarContent} from "@mui/material";
import {getCookie} from "../../../getCookie";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import ErrorIcon from "@mui/icons-material/Error";
import CloseIcon from "@mui/icons-material/Close";
import {InfoIcon} from "lucide-react";

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
    const token = localStorage.getItem("jwtToken");

    const tables = await fetch("http://localhost:8080/api/databaseinfo/getAvailableDatabaseNames/" + userName, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return await tables.json();
}

async function fetchAvailableTables(selectedDatabase) {
    const userName = getCookie("userName");
    const token = localStorage.getItem("jwtToken");
    const url = "http://localhost:8080/api/tableinfo/getAvailableTables/" + userName + "/" + selectedDatabase;
    const tables = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return await tables.json();
}

async function fetchStructure(databaseName, selectedTable) {
    const userName = getCookie("userName");
    const token = localStorage.getItem("jwtToken");
    const response = await fetch(
        `http://localhost:8080/api/tableinfo/getTableStructure/${userName}/${databaseName}/${selectedTable}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
}

async function fetchConnection(databaseName, selectedTableOne, selectedTableMany) {
    const userName = getCookie("userName");
    const token = localStorage.getItem("jwtToken");
    try {
        const response = await fetch(
            `http://localhost:8080/api/tableconnection/getConnectionDetails/${databaseName}/${selectedTableOne}/${selectedTableMany}/${userName}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
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
        return null;
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

    const [isEdgesSet, setIsEdgesSet] = useState(false);

    const [connectionID, setConnectionID] = useState(-1);

    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    const [errorMessage, setErrorMessage] = useState("");
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState("");

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState("");

    const [buttonClicked, setButtonClicked] = useState(false);

    const handleCloseErrorSnackbar = () => {
        setOpenErrorSnackbar(false);
    };

    function handleCloseSnackbar() {
        setOpenSnackbar(false);
    }

    useEffect(() => {
        fetchAvailableDatabases(userName)
            .then(data => {
                setAvailableDatabases(data);
            })
            .catch(e => {
                setErrorMessage("Error loading databases.");
                setOpenErrorSnackbar(true);
                setAvailableDatabases([]);
            })
        ;
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
        try {
            loadTables();
            setButtonClicked(false);
        } catch (e) {
            setErrorMessage("Error loading tables.");
            setOpenErrorSnackbar(true);
            setAvailableDatabases([])
        }
    }, [selectedDatabase]);

    useEffect(() => {
        if (selectedTableOne !== "") {
            const filtered = availableTables.filter(table => table !== selectedTableOne);
            setFilteredTables(filtered);
        }
        setButtonClicked(false);
    }, [selectedTableOne]);

    useEffect(() => {
        if (selectedTableMany !== "" && selectedTableOne !== "") {
            fetchStructure(selectedDatabase, selectedTableOne)
                .then(data => {
                    setTableOneContent(data);
                });
            fetchStructure(selectedDatabase, selectedTableMany)
                .then(data => {
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
        setButtonClicked(false);
    }, [selectedTableMany])

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
                        setConnectionID(data.id);
                        const edge = [
                            {
                                id: "e1-2",
                                source: "1",
                                target: "2",
                                sourceHandle: data.oneColumnName,
                                targetHandle: data.manyColumnName,
                            }
                        ];
                        setEdges(edge);
                        setIsEdgesSet(true);
                    }
                });
        }
    }, [selectedDatabase, selectedTableOne, selectedTableMany]);


    return (
        <div>
            <Paper sx={{ width: 'calc(80vw)', height: 'calc(86vh)', overflow: 'auto' }} elevation={3} style={{ padding: '10px', margin: '10px', borderRadius: '8px' }}>
                    <Select
                        labelId="demo-simple-select-database"
                        id="demo-simple-database"
                        value={selectedDatabase}
                        label="Select Database"
                        onChange={(event) => setSelectedDatabase(event.target.value)}
                        variant={"outlined"}
                        style={{marginRight: '10px'}}
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
                            style={{marginRight: '10px'}}
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
                            style={{marginRight: '10px'}}
                        >
                            {filteredTables.map((option, index) => (
                                <MenuItem key={index} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    )}

                    {selectedDatabase && selectedTableOne && selectedTableMany && (
                        <Button onClick={() => setButtonClicked(true)} className="button button-update" variant={"contained"}>
                            Open connection menu
                        </Button>
                    )}

                    {
                        selectedDatabase !== "" &&
                        selectedTableOne !== "" &&
                        selectedTableMany !== "" &&
                        isEdgesSet === true &&
                        tableManyContent.length > 0 &&
                        tableOneContent.length > 0 &&
                        buttonClicked !== false &&
                        nodes.length > 0 && (
                            <ReactFlowProvider>
                                <LayoutFlow
                                    selectedDatabase={selectedDatabase}
                                    initialNodes={nodes}
                                    initialEdges={edges}
                                    selectedTableOne={selectedTableOne}
                                    selectedTableMany={selectedTableMany}
                                    id={connectionID}
                                    setOpenSnackbar={setOpenSnackbar}
                                    setMessage={setMessage}
                                    setErrorMessage={setErrorMessage}
                                    setOpenErrorSnackbar={setOpenErrorSnackbar}
                                />
                            </ReactFlowProvider>
                        )
                    }

                <Snackbar
                    open={openErrorSnackbar}
                    autoHideDuration={6000}
                    onClose={handleCloseErrorSnackbar}
                >
                    <SnackbarContent
                        style={{ backgroundColor: '#ff0000' }}
                        message={
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                <ErrorIcon style={{ marginRight: 8 }} />
                                {errorMessage}
                            </span>
                        }
                        action={[
                            <IconButton
                                key="close"
                                aria-label="close"
                                color="inherit"
                                onClick={handleCloseErrorSnackbar}
                            >
                                <CloseIcon />
                            </IconButton>,
                        ]}
                    />
                </Snackbar>

                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                >
                    <SnackbarContent
                        style={{ backgroundColor: '#4365da' }}
                        message={
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                <InfoIcon style={{ marginRight: 8 }} />
                                {message}
                            </span>
                        }
                        action={[
                            <IconButton
                                key="close"
                                aria-label="close"
                                color="inherit"
                                onClick={handleCloseSnackbar}
                            >
                                <CloseIcon />
                            </IconButton>,
                        ]}
                    />
                </Snackbar>
            </Paper>
        </div>
    );

}

const LayoutFlow = ({ selectedDatabase,
                      initialNodes,
                      initialEdges,
                      selectedTableOne,
                      selectedTableMany,
                      id,
                      setMessage,
                      setOpenSnackbar,
                      setErrorMessage,
                      setOpenErrorSnackbar }) => {

    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

    const [isReady, setIsReady] = useState(false);

    function swapNodes(nodes, setNodes) {
        if (nodes.length !== 2) {
            console.error("There must be exactly two nodes to swap IDs and positions.");
            return;
        }

        const updatedNodes = [...nodes];

        const [node1, node2] = updatedNodes;
        const tempId = node1.id;
        const tempPosition = node1.position;

        node1.id = node2.id;
        node1.position = node2.position;

        node2.id = tempId;
        node2.position = tempPosition;

        setNodes(updatedNodes);
    }

    useEffect(() => {

        const isValid = validateEdges(edges, nodes);
        if (isValid !== true) {
            swapNodes(nodes, setNodes);
        }
        setIsReady(true);
    }, []);

    function validateEdges(edges, nodes) {
        for (const edge of edges) {
            const sourceNode = nodes.find(node => node.id === edge.source);
            const targetNode = nodes.find(node => node.id === edge.target);

            if (!sourceNode) {
                return false;
            }
            if (!targetNode) {
                return false;
            }

            const sourceColumn = sourceNode.data.schema.find(column => column.title === edge.sourceHandle);
            if (!sourceColumn) {
                return false;
            }

            const targetColumn = targetNode.data.schema.find(column => column.title === edge.targetHandle);
            if (!targetColumn) {
                return false;
            }

            const validSourceTypes = ['long', 'integer'];
            const validTargetTypes = ['long', 'integer'];

            if (
                !validSourceTypes.includes(sourceColumn.type) ||
                !validTargetTypes.includes(targetColumn.type)
            ) {
                console.error(`Invalid data types in edge "${edge.id}": Source (${sourceColumn.type}) and Target (${targetColumn.type}) must be "long" or "integer".`);
                return false;
            }
        }

        return true;
    }

    function onConnect(params) {
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
            }
        }

    }

    function handleEdgesChange(changes) {

    }

    async function addEdges() {
        let payload = {};

        if (edges.length === 0) {
            const token = localStorage.getItem("jwtToken");
            try {
                const response = await fetch(`http://localhost:8080/api/tableconnection/delete/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });



                if (response.ok) {
                    const message = await response.text();
                    setMessage("Successfully deleted a connection")
                    setOpenSnackbar(true);
                } else {
                    const errorMessage = await response.text();
                    console.error("Error:", errorMessage);
                }
            } catch (error) {
                console.error("Network error:", error);
            }
            return;
        }

        const sourceNode = nodes[0];
        const targetNode = nodes[1];
        let primaryKeyTable;

        if ((edges[0].sourceHandle === sourceNode.data.schema[0]['title']) && (edges[0].targetHandle === targetNode.data.schema[0]['title'])) {
            setErrorMessage("Only one table with primary key");
            setOpenErrorSnackbar(true);
            return;
        }

        if (edges[0].sourceHandle === sourceNode.data.schema[0]['title']) {

            payload["manyTableName"] = targetNode.data['label'];
            payload["manyColumnName"] = edges[0].targetHandle;

            payload["oneTableName"] = sourceNode.data['label'];
            payload["oneColumnName"] = edges[0].sourceHandle;
        }
        else if (edges[0].targetHandle === targetNode.data.schema[0]['title']) {
            payload["manyTableName"] = sourceNode.data['label'];
            payload["manyColumnName"] = edges[0].sourceHandle;

            payload["oneTableName"] = targetNode.data['label'];
            payload["oneColumnName"] = edges[0].targetHandle;
        }
        else {
            setErrorMessage("Select one table with primary key");
            setOpenErrorSnackbar(true);
            return;
        }

        if (id < 0) {
            try {
                const token = localStorage.getItem("jwtToken");
                const response = await fetch(`http://localhost:8080/api/tableconnection/addconnection`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    const message = await response.text();
                    setMessage("Successfully added a connection")
                    setOpenSnackbar(true);
                } else {
                    const errorMessage = await response.text();
                    console.error("Error:", errorMessage);
                }
            } catch (error) {
                console.error("Network error:", error);
            }

        } else {
            const userName = getCookie("userName");
            const token = localStorage.getItem("jwtToken");

            try {
                const response = await fetch(`http://localhost:8080/api/tableconnection/update/${id}/${userName}/${selectedDatabase}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    const message = await response.text();
                    setMessage("Successfully updated a connection")
                    setOpenSnackbar(true);
                } else {
                    const errorMessage = await response.text();
                    console.error("Error:", errorMessage);
                }
            } catch (error) {
                console.error("Network error:", error);
            }

        }
    }

    const handleEdgeClick = (event, edge) => {
        setEdges([]);
    };


    return (
        <div style={{ width: '100%', height: '93%' }}>
            {isReady === true && (
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={handleEdgesChange}
                fitView
                onEdgeClick={handleEdgeClick}
                onConnect={onConnect}
                nodeTypes={nodeTypes}

            >
                <Panel position="top-left">
                    <h4 style={{marginBottom: '10px'}}>Selected database: {selectedDatabase}</h4>
                    <Button onClick={addEdges} variant={"contained"} color={"primary"}>
                        Commit changes
                    </Button>
                </Panel>
                <Background/>
            </ReactFlow>
            )}
        </div>
    );
};


export default ConnectionsCreator;
