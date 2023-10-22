package org.example;

import java.sql.*;
import java.util.HashSet;
import java.util.Set;

public class DatabaseCreator {
    DatabaseInfo serverDb;
    DatabaseInfo clientDB;

    public DatabaseCreator(DatabaseInfo serverDb, DatabaseInfo clientDB) {
        this.serverDb = serverDb;
        this.clientDB = clientDB;

        String databaseName = getDatabaseName();
        Set<String> tableNames = getTableNames();
        System.out.println(tableNames);

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
}
