class QueryLogger {
    static instance;
    static logs = [];

    static getInstance() {
        if (!QueryLogger.instance) {
            QueryLogger.instance = new QueryLogger();
        }
        return QueryLogger.instance;
    }

    static addLog(message, level) {
        QueryLogger.logs.push({ message, level });
    }

    static getLogs() {
        return QueryLogger.logs;
    }
}

export const logging_level = {
    INSERT: 'insert',
    DELETE: 'delete',
    UPDATE: 'update',
    SELECT: 'select',
    ALTER_STRUCTURE: 'alter_structure'
};

export default QueryLogger;
