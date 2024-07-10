class QueryLogger {
    static instance;
    static logs = [];

    static getInstance() {
        if (!QueryLogger.instance) {
            QueryLogger.instance = new QueryLogger();
        }
        return QueryLogger.instance;
    }

    addLog(log) {
        QueryLogger.logs.push(log);
        console.log("PUSHED")
        console.log(QueryLogger.logs)
    }

    getLogs() {
        return QueryLogger.logs;
    }
}

export default QueryLogger;
