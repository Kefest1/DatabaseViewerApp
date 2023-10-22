package org.example;

import java.sql.*;
import java.util.HashSet;
import java.util.Set;

public class Main {
    public static void main(String[] args) {
        //        String jdbcUrl = "jdbc:postgresql://localhost:5432/northwind";
//        String username = "username";
//        String password = "password";
//
//        try {
//            Connection connection = DriverManager.getConnection(jdbcUrl, username, password);
//
//            connection.close();
//        } catch (SQLException e) {
//            System.err.println("Connection to the database failed.");
//            e.printStackTrace();
//        }
        var serverDB = new DatabaseInfo(
                "jdbc:postgresql://localhost:5432/database",
                "username",
                "password"
        );
        var clientDB = new DatabaseInfo(
                "jdbc:postgresql://localhost:5432/northwind",
                "username",
                "password"
        );
        new DatabaseCreator(serverDB, clientDB);

    }


}