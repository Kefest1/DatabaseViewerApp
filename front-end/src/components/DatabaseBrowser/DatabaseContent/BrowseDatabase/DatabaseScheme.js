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

const defaultEdges: Edge[] = [
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

function DatabaseScheme() {
    return (
        <div className="h-full w-full" style={{height: 1000, width: 1800}}>
            <ReactFlow
                defaultNodes={defaultNodes}
                defaultEdges={defaultEdges}
                nodeTypes={nodeTypes}
                fitView
                nodesConnectable={false}
                edgesFocusable={false}
            >
                <Background />
                <MiniMap />
            </ReactFlow>
        </div>
    );
}

export default DatabaseScheme;
