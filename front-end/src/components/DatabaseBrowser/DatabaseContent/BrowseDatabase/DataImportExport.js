function exportCsv(data) {
    const columnNames = data[0].map((column) => column.columnName);
    const csvRows = [columnNames.join(",")];

    data.forEach((array) => {
        const row = [];
        array.forEach((obj) => {
            row.push(obj.dataValue);
        });
        csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${localStorage.getItem("selectedDatabase")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

function exportXml(data) {
    const columnNames = data[0].map((column) => column.columnName);
    const xmlRows = ['<?xml version="1.0" encoding="UTF-8"?>'];
    xmlRows.push('<root>');

    data.forEach((array, index) => {
        xmlRows.push(`  <row id="${index + 1}">`);
        array.forEach((obj) => {
            xmlRows.push(`    <${obj.columnName}>${obj.dataValue}</${obj.columnName}>`);
        });
        xmlRows.push('  </row>');
    });

    xmlRows.push('</root>');
    const xmlString = xmlRows.join('\n');
    const blob = new Blob([xmlString], { type: "text/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${localStorage.getItem("selectedDatabase")}.xml`;
    a.click();
    URL.revokeObjectURL(url);
}

function exportJson(data) {
    const jsonData = data.map((array) => {
        const row = {};
        array.forEach((obj) => {
            row[obj.columnName] = obj.dataValue;
        });
        return row;
    });

    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${localStorage.getItem("selectedDatabase")}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

export { exportCsv, exportXml, exportJson };
