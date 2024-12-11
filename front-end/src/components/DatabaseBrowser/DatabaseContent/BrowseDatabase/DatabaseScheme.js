"use client";

import {Background, MiniMap, ReactFlow} from "@xyflow/react";
import { DatabaseSchemaNode } from "../components/database-schema-node";
import React, {useEffect, useRef, useState} from "react";
import Box from '@mui/material/Box';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';

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

const defaultEdges = [
    {
        id: "products-warehouses",
        source: "1",
        target: "2",
        sourceHandle: "warehouse_id",
        targetHandle: "id",
    },
    {
        id: "products-suppliers",
        source: "1",
        target: "3",
        sourceHandle: "supplier_id",
        targetHandle: "id",
    },
];

const nodeTypes = {
    databaseSchema: DatabaseSchemaNode,
};

const nodeWidth = 172;
const nodeHeight = 36;

function getLayoutedElements(nodes, edges) {
    const g = new dagre.Graph();
    g.setGraph({ rankdir: 'TB' });
    g.setDefaultEdgeLabel(() => ({}));

    // Add nodes to the graph
    nodes.forEach((node) => {
        g.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    // Add edges to the graph
    edges.forEach((edge) => {
        g.setEdge(edge.source, edge.target);
    });

    // Calculate the layout
    dagre.layout(g);

    // Get the layouted nodes
    const layoutedNodes = nodes.map((node) => {
        const { x, y } = g.node(node.id);
        node.position = { x: x - nodeWidth / 2, y: y - nodeHeight / 2 };
        return node;
    });

    return { layoutedNodes, edges };
}

function DatabaseScheme() {
    const [elements, setElements] = useState({ nodes: defaultNodes, edges: defaultEdges });

    useEffect(() => {
        const { layoutedNodes, edges } = getLayoutedElements(defaultNodes, defaultEdges);
        setElements({ nodes: layoutedNodes, edges });
    }, []);

    return (
        <Box sx={{ height: 1010, width: 1700 }}>
            <ReactFlow
                nodes={elements.nodes}
                edges={elements.edges}
                nodeTypes={nodeTypes}
                fitView
                draggable={true}
            >
                <Background />
                <MiniMap />
            </ReactFlow>
        </Box>
    );
}

export default DatabaseScheme;
