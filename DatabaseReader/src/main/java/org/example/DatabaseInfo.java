package org.example;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@ToString
public class DatabaseInfo {
    private String jdbcUrl;
    private String username;
    private String password;

    private DatabaseInfo() {}

}
