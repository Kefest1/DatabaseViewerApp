"use client";

import {
    Background,
    MiniMap,
    Panel,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
    useReactFlow
} from "@xyflow/react";
import {DatabaseSchemaNode} from "../components/database-schema-node";

import React, {useCallback, useEffect, useState} from "react";
import '@xyflow/react/dist/style.css';
import Dagre from '@dagrejs/dagre';
import {getCookie} from "../../../getCookie";
import {MenuItem} from "@mui/material";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";

async function fetchAvailableDatabases() {
    const userName = getCookie("userName");
    const tables = await fetch(
        "http://localhost:8080/api/tableinfo/getAvailableDatabases/" + userName
    );
    return await tables.json();
}

async function fetchAvailableConnections(databaseName) {
    const userName = getCookie("userName");
    const tables = await fetch(
        "http://localhost:8080/api/tableconnection/getDatabaseConnection/" + databaseName + "/" + userName
    );
    return await tables.json();
}

async function fetchDatabaseStructure(databaseName) {
    const url = "http://localhost:8080/api/tableinfo/getDatabaseStructure/" + databaseName;
    const tables = await fetch(
        url
    );
    return await tables.json();
}

const getLayoutedElements = (nodes, edges, options) => {
    const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: options.direction });

    edges.forEach((edge) => g.setEdge(edge.source, edge.target));
    nodes.forEach((node) =>
        g.setNode(node.id, {
            ...node,
            width: node.measured?.width ?? 0,
            height: node.measured?.height ?? 0,
        }),
    );

    Dagre.layout(g);

    return {
        nodes: nodes.map((node) => {
            const position = g.node(node.id);
            const x = position.x - (node.measured?.width ?? 0) / 2;
            const y = position.y - (node.measured?.height ?? 0) / 2;

            return { ...node, position: { x, y } };
        }),
        edges,
    };
};

const nodeTypes = {
    databaseSchema: DatabaseSchemaNode,
};

const mapColumnType = (type) => {
    switch (type) {
        case "Long":
            return "bigint";
        case "Integer":
            return "int4";
        case "String":
            return "varchar";
        case "Number":
            return "numeric";
        case "Timestamp":
            return "timestamp";
        default:
            return "unknown";
    }
};

function prepareNodes(tableStructure) {
    return tableStructure.map((table) => {
        const id = table.tableName.charAt(0).toUpperCase() + table.tableName.slice(1);

        const schema = table.tableStructures.map(column => ({
            title: column.columnName,
            type: mapColumnType(column.columnType)
        }));

        return {
            id: id,
            position: { x: 0, y: 0 },
            type: "databaseSchema",
            data: {
                label: table.tableName.charAt(0).toUpperCase() + table.tableName.slice(1),
                schema: schema
            }
        };
    });
}

function prepareEdges(data) {
    return data.map(item => ({
        id: `${item.manyTableName}-${item.oneTableName}`,
        source: item.manyTableName.charAt(0).toUpperCase() + item.manyTableName.slice(1),
        target: item.oneTableName.charAt(0).toUpperCase() + item.oneTableName.slice(1),
        sourceHandle: item.manyColumnName,
        targetHandle: item.oneColumnName
    }));
}

const LayoutFlow = ({selectedDatabase, initialNodes, initialEdges}) => {
    const { fitView } = useReactFlow();
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [isLayoutApplied, setIsLayoutApplied] = useState(0);

    const applyLayout = useCallback(
        (direction) => {
            const layouted = getLayoutedElements(nodes, edges, { direction });

            setNodes([...layouted.nodes]);
            setEdges([...layouted.edges]);

            window.requestAnimationFrame(() => {
                fitView();
            });
        },
        [nodes, edges, fitView]
    );

    useEffect(() => {
        if (isLayoutApplied < 4) {
            applyLayout('LR');
            setIsLayoutApplied(isLayoutApplied + 1);
        }
    }, [applyLayout]);

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            nodeTypes={nodeTypes}
            nodesConnectable={false}
            edgesFocusable={false}
        >
            <Panel position="top-left">
                <h4 style={{marginBottom : '10px'}}>Selected database: {selectedDatabase}</h4>
                <Button variant={"contained"} onClick={() => applyLayout('LR')}>
                    Layout scheme
                </Button>
            </Panel>
            <MiniMap />
            <Background />
        </ReactFlow>
    );
};

function DatabaseScheme() {
    const [availableDatabases, setAvailableDatabases] = useState([]);
    const [selectedDatabase, setSelectedDatabase] = useState("");

    const [connections, setConnections] = useState([]);

    const [databaseStructure, setDatabaseStructure] = useState([]);
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    useEffect(() => {
        const loadDatabases = async () => {
            const availableDBs = await fetchAvailableDatabases();
            setAvailableDatabases(availableDBs);
        };
        loadDatabases();
    }, []);

    useEffect(() => {
        const loadConnections = async () => {
            const connections = await fetchAvailableConnections(selectedDatabase);
            setConnections(connections);
        };

        if (selectedDatabase !== "") {
            loadConnections();
        }

    }, [selectedDatabase]);

    useEffect(() => {
        const loadDatabaseStructure = async () => {
            const dbStructure = await fetchDatabaseStructure(selectedDatabase);
            setDatabaseStructure(dbStructure);
        };

        if (selectedDatabase !== "") {
            loadDatabaseStructure();
            console.log(databaseStructure);
        }
    }, [selectedDatabase]);

    useEffect(() => {
        if (databaseStructure.length > 0) {
            const initialNodes = prepareNodes(databaseStructure);
            setNodes(initialNodes);
        }
    }, [databaseStructure]);

    useEffect(() => {
        if (connections.length > 0) {
            const initialConnections = prepareEdges(connections);
            setEdges(initialConnections);
        }
    }, [connections]);

    return (
        <div className="h-full w-full" style={{ height: 783, width: 1600 }}>

            {selectedDatabase === "" && (
                <Select
                    labelId="demo-simple-select-table"
                    id="demo-simple-table"
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
            )}

            {selectedDatabase !== "" && nodes.length > 0 && (
                <ReactFlowProvider>
                    <LayoutFlow selectedDatabase={selectedDatabase} initialNodes={nodes} initialEdges={edges}/>
                </ReactFlowProvider>
            )}
        </div>
    );
}

export default DatabaseScheme;
