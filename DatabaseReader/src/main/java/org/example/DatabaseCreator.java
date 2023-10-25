package org.example;

import java.sql.*;
import java.util.HashSet;
import java.util.Set;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;


public class DatabaseCreator {
    DatabaseInfo serverDb;
    DatabaseInfo clientDB;

    Connection serverConnection;
    Connection clientConnection;

    public DatabaseCreator(DatabaseInfo serverDb, DatabaseInfo clientDB) {
        this.serverDb = serverDb;
        this.clientDB = clientDB;

        try {
            serverConnection = DriverManager.getConnection(serverDb.getJdbcUrl(), serverDb.getUsername(), serverDb.getPassword());
            clientConnection = DriverManager.getConnection(clientDB.getJdbcUrl(), clientDB.getUsername(), clientDB.getPassword());
        } catch (SQLException e) {
            return;
        }

        String databaseName = setDatabaseName();
        int databaseID = getDatabaseID(databaseName);

        Set<String> tableNames = getTableNames();
        setTableInfo(tableNames, databaseID);

        setFieldInfo(tableNames);

        try {
            clientConnection.close();
            serverConnection.close();
        } catch (SQLException ignored) {

        }

    }

    private String getDatabaseName() {
        try {

            Statement statement = clientConnection.createStatement();
            String sqlQuery = "SELECT current_database()";
            ResultSet resultSet = statement.executeQuery(sqlQuery);

            resultSet.next();
            String databaseName = resultSet.getString("current_database");

            resultSet.close();
            statement.close();
            return databaseName;
        } catch (SQLException e) {
            return null;
        }

    }

    private int getDatabaseID(String databaseName) {
        int databaseID;
        try {

            Statement statement = serverConnection.createStatement();
            String sqlQuery = "SELECT database_id FROM database_info WHERE database_name = '" + databaseName + "';";
            ResultSet resultSet = statement.executeQuery(sqlQuery);

            resultSet.next();
            databaseID = resultSet.getInt("database_id");

            resultSet.close();
            statement.close();
        } catch (SQLException e) {
            return -1;
        }

        return databaseID;
    }

    private String setDatabaseName() {
        String databaseName = getDatabaseName();
        try {

            Statement statement = serverConnection.createStatement();
            String sqlQuery = "INSERT INTO database_info(database_name)" +
                    " VALUES ('" + databaseName + "');";
            statement.executeUpdate(sqlQuery);

            statement.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return databaseName;
    }

    private Set<String> getTableNames() {
        Set<String> tableNames = new HashSet<>();
        try {

            Statement statement = clientConnection.createStatement();
            String sqlQuery = """
                    SELECT table_name
                    FROM information_schema.tables
                    WHERE table_schema = 'public';""";

            ResultSet resultSet = statement.executeQuery(sqlQuery);

            while (resultSet.next())
                tableNames.add(resultSet.getString("table_name"));

            resultSet.close();
            statement.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return tableNames;
    }

    private void setTableInfo(Set<String> tableNames, int databaseID) {
        try {
            for (String tableName : tableNames) {
                String insertSQL = "INSERT INTO table_info (table_name, database_id) VALUES (?, ?);";
                try (PreparedStatement statement = serverConnection.prepareStatement(insertSQL)) {
                    statement.setString(1, tableName);
                    statement.setInt(2, databaseID);
                    statement.executeUpdate();
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }


    private String getDataTypeFromColumn(String tableName, String columnName) {
        try {
            DatabaseMetaData metaData = clientConnection.getMetaData();
            ResultSet columns = metaData.getColumns(null, null, tableName, columnName);

            if (columns.next()) {
                return columns.getString("TYPE_NAME");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null; // Return null if the column or table is not found
    }

    private void setFieldInfo(Set<String> tableNames) {

        for (String table : tableNames) {
            fetchTableInfo(table);
        }

    }

    private void fetchTableInfo(String tableName) {
        Set<String> columnNames = new HashSet<>();

        try {
            String query = "SELECT * FROM " + tableName + " LIMIT 1";
            Statement statement = clientConnection.createStatement();
            ResultSet resultSet = statement.executeQuery(query);
            if (resultSet.next()) {
                int columnCount = resultSet.getMetaData().getColumnCount();
                for (int i = 1; i <= columnCount; i++) {
                    String columnName = resultSet.getMetaData().getColumnName(i);
                    columnNames.add(columnName);
                }
            }

            for (String column : columnNames) {
                setColumnInfo(tableName, column);
            }


        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void setColumnInfo(String tableName, String columnName) {
        int id = getTableId(tableName);
        String datatype = getDataTypeFromColumn(tableName, columnName);
        String query = "SELECT " + columnName + " AS C FROM " + tableName + ";";
        try {
            Statement statement = clientConnection.createStatement();
            ResultSet resultSet = statement.executeQuery(query);
            while (resultSet.next()) {
                var x = resultSet.getString(1);
                insertColumnInfo(id, columnName, datatype, x);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void insertColumnInfo(int tableID, String columnName, String datatype, String dataValue) {
        String safeDataValue = dataValue.replace("'", "''");
        String query = "INSERT INTO field_info(table_id, column_name, data_type, data_value)" +
                " VALUES(" + tableID + ", '" + columnName + "', '" + datatype + "', '" + safeDataValue + "');";

        try {
            Statement statement = serverConnection.createStatement();
            statement.executeUpdate(query);
            statement.close();
        } catch (Exception e) {
            System.out.println();
        }

    }

    private int getTableId(String tableName) {

        try {
            String query = "SELECT id FROM table_info WHERE table_name = '" + tableName + "'";
            Statement statement = serverConnection.createStatement();
            ResultSet resultSet = statement.executeQuery(query);
            resultSet.next();

            return resultSet.getInt("id");
        } catch (Exception e) {
            e.printStackTrace();
        }

        return -1;
    }

}
