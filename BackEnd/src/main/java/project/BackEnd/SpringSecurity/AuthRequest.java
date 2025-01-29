package project.BackEnd.SpringSecurity;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@ToString
@NoArgsConstructor
public class AuthRequest {
    private String username;
    private String password;
}