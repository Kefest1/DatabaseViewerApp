package project.BackEnd.User;

import lombok.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class UserPayload {
    private String username;
    private String email;
    private String password_hash;
    private String hash;
    private String adminName;
}
