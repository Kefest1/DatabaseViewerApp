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

    public DatabaseCreator(DatabaseInfo serverDb, DatabaseInfo clientDB) {
        this.serverDb = serverDb;
        this.clientDB = clientDB;

        String databaseName = getDatabaseName();
//        setDatabaseName(databaseName);
        int databaseID = getDatabaseID(databaseName);

        Set<String> tableNames = getTableNames();
        System.out.println(tableNames);
        setTableInfo(tableNames, databaseID);
        setFieldInfo(tableNames);
//        for (String tbname : tableNames) {
//            getTableInfo(tbname);
//        }

    }

    private String getDatabaseName() {
        String databaseName = null;
        try {
            Connection connection = DriverManager.getConnection(clientDB.getJdbcUrl(), clientDB.getUsername(), clientDB.getPassword());

            Statement statement = connection.createStatement();
            String sqlQuery = "SELECT current_database()";
            ResultSet resultSet = statement.executeQuery(sqlQuery);

            resultSet.next();
            databaseName = resultSet.getString("current_database");

            resultSet.close();
            statement.close();
            connection.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return databaseName;
    }

    private int getDatabaseID(String databaseName) {
        int databaseID = -1;
        try {
            Connection connection = DriverManager.getConnection(serverDb.getJdbcUrl(), serverDb.getUsername(), serverDb.getPassword());

            Statement statement = connection.createStatement();
            String sqlQuery = "SELECT database_id FROM database_info WHERE database_name = \'" + databaseName + "\';";
            ResultSet resultSet = statement.executeQuery(sqlQuery);

            resultSet.next();
            databaseID = resultSet.getInt("database_id");

            resultSet.close();
            statement.close();
            connection.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return databaseID;
    }

    private int setDatabaseName(String databaseName) {
        try {
            Connection connection = DriverManager.getConnection(serverDb.getJdbcUrl(), serverDb.getUsername(), serverDb.getPassword());

            Statement statement = connection.createStatement();
            String sqlQuery = "INSERT INTO database_info(database_name)" +
                    " VALUES (\'" + databaseName + "\');";
            statement.executeUpdate(sqlQuery);

            statement.close();
            connection.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return 0;
    }

    private Set<String> getTableNames() {
        Set<String> tableNames = new HashSet<>();
        try {
            Connection connection = DriverManager.getConnection(clientDB.getJdbcUrl(), clientDB.getUsername(), clientDB.getPassword());

            Statement statement = connection.createStatement();
            String sqlQuery = "SELECT table_name\n" +
                    "FROM information_schema.tables\n" +
                    "WHERE table_schema = 'public';";

            ResultSet resultSet = statement.executeQuery(sqlQuery);

            while (resultSet.next())
                tableNames.add(resultSet.getString("table_name"));

            resultSet.close();
            statement.close();
            connection.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return tableNames;
    }

    private boolean setTableInfo(Set<String> tableNames, int databaseID) {
        Connection connection = null;
        try {
            connection = DriverManager.getConnection(serverDb.getJdbcUrl(), serverDb.getUsername(), serverDb.getPassword());
            for (String tableName : tableNames) {
                String insertSQL = "INSERT INTO table_info (table_name, database_id) VALUES (?, ?);";
                try (PreparedStatement statement = connection.prepareStatement(insertSQL)) {
                    statement.setString(1, tableName);
                    statement.setInt(2, databaseID);
                    statement.executeUpdate();
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        return true;

        /*
        try {
            Connection connection = DriverManager.getConnection(clientDB.getJdbcUrl(), clientDB.getUsername(), clientDB.getPassword());

            Statement statement = connection.createStatement();
            String sqlQuery;
            for (String tablename : tableNames) {
                HashSet<String> columnTypes = new HashSet<>();
                sqlQuery = "SELECT column_name\n" +
                        "FROM information_schema.columns\n" +
                        "WHERE table_name = '" + tablename + "';";

                ResultSet resultSet = statement.executeQuery(sqlQuery);
                while (resultSet.next())
                    columnTypes.add(resultSet.getString("column_name"));
                System.out.println(columnTypes);

                for (String colName : columnTypes) {
                    fetchDataFromColumn(connection, tablename, colName);
                }
            }

//            String sqlQuery = "INSERT INTO tableinfo VALUES(" + tableName;

//            ResultSet resultSet = statement.executeQuery(sqlQuery);
//
//            while (resultSet.next())
//                tableNames.add(resultSet.getString("table_name"));
//
//            resultSet.close();
            statement.close();
            connection.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;*/
    }

    private void fetchDataFromColumn(Connection connection, String tableName, String columnName) {
        String sqlQuery = "SELECT " + columnName + " from " + tableName + ";";
        String dataType = getDataTypeFromColumn(connection, tableName, columnName);

        try {
            Statement statement = connection.createStatement();

            ResultSet resultSet = statement.executeQuery(sqlQuery);
            while (resultSet.next()) {
                System.out.println("-------");
                var x = resultSet.getString(1);
                var xd = resultSet.getMetaData().getColumnType(1);
                System.out.println(x);
                System.out.println(xd);
                System.out.println("-------");
            }

        } catch (Exception e) {
            return;
        }
    }

    private String getDataTypeFromColumn(Connection connection, String tableName, String columnName) {
        try {
            DatabaseMetaData metaData = connection.getMetaData();
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
        try {
            Connection connection = DriverManager.getConnection(clientDB.getJdbcUrl(), clientDB.getUsername(), clientDB.getPassword());
            for (String table : tableNames) {
                fetchTableInfo(connection, table);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

    }
// TODO tableid
    private void fetchTableInfo(Connection connection, String tableName) {
        Set<String> columnNames = new HashSet<>();

        try {
            String query = "SELECT * FROM " + tableName + " LIMIT 1";
            Statement statement = connection.createStatement();
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

    }


}
