package org.example;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Data
public class UserRegisterPayload {

    private Long id;
    private int masterID;
    private String username;
    private String email;
    private String password_hash;
    private String registration_code;

}

