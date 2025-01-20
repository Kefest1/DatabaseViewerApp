import React, { useState, useEffect } from 'react';
import QueryLogger from './QueryLogger';
import {Paper} from "@mui/material";

const QueryLoggerComponent = () => {
    const [logs, setLogs] = useState([]);

    const logger = QueryLogger.getInstance();

    useEffect(() => {
        setLogs(logger.getLogs());
    }, []);

    useEffect(() => {
        logger.addLog = (log) => {
            logger.logs.push(log);
            setLogs(logger.logs);
        };
    }, []);

    return (
        <Paper sx={{ width: 'calc(80vw)', height: 'calc(86vh)', overflow: 'auto' }} elevation={3} style={{ padding: '10px', margin: '10px', borderRadius: '8px' }}>

        <div>
            <h2>Query Logs</h2>
            <ul>
                {logs.map((log, index) => (
                    <li key={index}>{log}</li>
                ))}
            </ul>
        </div>
        </Paper>
    );
};

export default QueryLoggerComponent;
