import React, { useState, useEffect } from 'react';
import QueryLogger from './QueryLogger';
import { Paper, FormControlLabel, Checkbox, Button } from "@mui/material";
import { logging_level } from './QueryLogger';

const QueryLoggerComponent = () => {
    const [logs, setLogs] = useState([]);
    const [selectedLevels, setSelectedLevels] = useState(
        Object.values(logging_level).filter((level) => level !== logging_level.SELECT)
    );

    useEffect(() => {
        setLogs(QueryLogger.getLogs());
    }, []);

    const handleLevelChange = (level) => {
        setSelectedLevels((prevSelected) => {
            if (prevSelected.includes(level)) {
                return prevSelected.filter((l) => l !== level);
            } else {
                return [...prevSelected, level];
            }
        });
    };

    const filteredLogs = logs.filter(log => selectedLevels.includes(log.level));

    const downloadLogs = () => {
        const logData = filteredLogs.map(log => `${log.level.toUpperCase()}: ${log.message}`).join('\n');
        const blob = new Blob([logData], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'logs.txt';
        a.click();

        URL.revokeObjectURL(url);
    };

    const printLogs = () => {
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = 'none';
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write('<html><head><title>Print Logs</title><style>body { font-family: Arial, sans-serif; font-size: 14px; }</style></head><body>');
        doc.write('<h2>Query Logs</h2>');
        doc.write('<ul>');

        filteredLogs.forEach(log => {
            doc.write(`<li><strong>${log.level.toUpperCase()}:</strong> ${log.message}</li>`);
        });

        doc.write('</ul>');
        doc.write('</body></html>');
        doc.close();

        iframe.onload = () => {
            iframe.contentWindow.print();
            document.body.removeChild(iframe);
        };
    };

    return (
        <Paper
            sx={{
                width: 'calc(80vw)',
                height: 'calc(86vh)',
                overflow: 'auto',
            }}
            elevation={3}
            style={{
                padding: '10px',
                margin: '10px',
                borderRadius: '8px'
            }}
        >
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
                    Query Logs
                </h5>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    marginBottom: '15px'
                }}>
                    {Object.values(logging_level).map((level, index) => (
                        <FormControlLabel
                            key={level}
                            control={
                                <Checkbox
                                    checked={selectedLevels.includes(level)}
                                    onChange={() => handleLevelChange(level)}
                                    sx={{
                                        color: index === 0 ? 'green' : index === 1 ? 'red' : index === 2 ? 'blue' : index === 3 ? 'purple' : index === 4 ? 'orange': 'default',
                                        '&.Mui-checked': {
                                            color: index === 0 ? 'green' : index === 1 ? 'red' : index === 2 ? 'blue' : index === 3 ? 'purple' : index === 4 ? 'orange': 'default',
                                        },
                                    }}
                                />
                            }
                            label={level.toUpperCase()}
                            style={{ marginRight: '10px' }}
                        />
                    ))}

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={downloadLogs}
                        style={{ marginLeft: 'auto' }}
                    >
                        Download Logs
                    </Button>

                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={printLogs}
                        style={{ marginLeft: '10px' }}
                    >
                        Print Logs
                    </Button>

                </div>

                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {filteredLogs.map((log, index) => (
                        <li
                            key={index}
                            style={{
                                padding: '10px',
                                margin: '5px 0',
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                                transition: 'background-color 0.3s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                        >
                            <div style={{ fontWeight: 'bold', color: '#333' }}>
                                {log.level.toUpperCase()}
                            </div>
                            <div style={{ color: '#555', fontSize: '14px' }}>
                                {log.message}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </Paper>
    );
};

export default QueryLoggerComponent;
