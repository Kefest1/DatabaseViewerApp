package org.example;

import java.sql.*;
import java.util.HashSet;
import java.util.Set;

public class Main {

    public static void main(String[] args) {
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
