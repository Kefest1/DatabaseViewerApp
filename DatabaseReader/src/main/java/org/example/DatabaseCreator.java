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

    Long columnIDGlobal;

    public DatabaseCreator(DatabaseInfo serverDb, DatabaseInfo clientDB) {
        this.serverDb = serverDb;
        this.clientDB = clientDB;
        this.columnIDGlobal = 0L;

        try {
            serverConnection = DriverManager.getConnection(serverDb.getJdbcUrl(), serverDb.getUsername(), serverDb.getPassword());  // database
            clientConnection = DriverManager.getConnection(clientDB.getJdbcUrl(), clientDB.getUsername(), clientDB.getPassword());  // northwind
        } catch (SQLException e) {
            return;
        }

        String databaseName = setDatabaseName();
        int databaseID = getDatabaseID(databaseName);

        Set<String> tableNames = getTableNames();
        setTableInfo(tableNames, databaseID);

        setFieldInfo(tableNames);
//
//        setTableConnections();
//
        try {
            clientConnection.close();
            serverConnection.close();
        } catch (SQLException ignored) {

        }

    }

    private void setTableConnections() {
        try {
            Statement statement = clientConnection.createStatement();
            String sqlQuery = "SELECT \n" +
                    "    tc.table_name, \n" +
                    "    kcu.column_name, \n" +
                    "    ccu.table_name AS foreign_table_name, \n" +
                    "    ccu.column_name AS foreign_column_name \n" +
                    "FROM \n" +
                    "    information_schema.table_constraints tc \n" +
                    "JOIN \n" +
                    "    information_schema.key_column_usage kcu \n" +
                    "ON \n" +
                    "    tc.constraint_name = kcu.constraint_name \n" +
                    "JOIN \n" +
                    "    information_schema.constraint_column_usage ccu \n" +
                    "ON \n" +
                    "    ccu.constraint_name = tc.constraint_name \n" +
                    "WHERE \n" +
                    "    tc.constraint_type = 'FOREIGN KEY';";

            ResultSet resultSet = statement.executeQuery(sqlQuery);

            while(resultSet.next()) {
                String tableName = resultSet.getString("table_name");
                String column_name = resultSet.getString("column_name");
                String foreign_table_name = resultSet.getString("foreign_table_name");
                String foreign_column_name = resultSet.getString("foreign_column_name");

                System.out.println(tableName);
                System.out.println(column_name);
                System.out.println(foreign_table_name);
                System.out.println(foreign_column_name);
                System.out.println();
            }


        } catch (SQLException e) {
            throw new RuntimeException(e);
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
        return null;
    }

    private void setFieldInfo(Set<String> tableNames) {

        for (String table : tableNames) {
            fetchTableInfo(table);
        }

    }

    private void fetchTableInfo(String tableName) {
        Set<String> columnNames = getColumnNames(tableName);
        setColumnInfo(tableName);

    }

    private Set<String> getColumnNames(String tableName) {
        Set <String> columnNames = new HashSet<>();
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
        }
        catch (Exception e) {
            e.printStackTrace();
        }


        return columnNames;
    }

    private void setColumnInfo(String tableName) {
        int id = getTableId(tableName);

        String query = "SELECT * FROM " + tableName + ";";
        try {
            Statement statement = clientConnection.createStatement();
            ResultSet resultSet = statement.executeQuery(query);
            ResultSetMetaData metaData = resultSet.getMetaData();
            int columnCount = metaData.getColumnCount();

            while (resultSet.next()) {
                this.columnIDGlobal++;
                for (int i = 1; i <= columnCount; i++) {
                    String fieldName = metaData.getColumnName(i);
                    String datatype = getDataTypeFromColumn(tableName, fieldName);
                    String fieldValue = resultSet.getString(i);
                    insertColumnInfo(id, fieldName, datatype, fieldValue, this.columnIDGlobal);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void insertColumnInfo(int tableID, String columnName, String datatype, String dataValue, Long column_id) {
        String safeDataValue = dataValue.replace("'", "''");
        String query = "INSERT INTO field_info(id, column_name, data_type, data_value, column_id)" +
                " VALUES(" + tableID + ", '" + columnName + "', '" + datatype + "', '" + safeDataValue + "', '" + column_id + "');";

        try {
            Statement statement = serverConnection.createStatement();
            statement.executeUpdate(query);
            statement.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    private int getTableId(String tableName) {

        try {
            String query = "SELECT table_info_id FROM table_info WHERE table_name = '" + tableName + "'";
            Statement statement = serverConnection.createStatement();
            ResultSet resultSet = statement.executeQuery(query);
            resultSet.next();

            return resultSet.getInt("table_info_id");
        } catch (Exception e) {
            e.printStackTrace();
        }

        return -1;
    }

}
