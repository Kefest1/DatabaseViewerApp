import React, { useState, useEffect } from 'react';
import QueryLogger from './QueryLogger';

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
        <div>
            <h2>Query Logs</h2>
            <ul>
                {logs.map((log, index) => (
                    <li key={index}>{log}</li>
                ))}
            </ul>
        </div>
    );
};

export default QueryLoggerComponent;
