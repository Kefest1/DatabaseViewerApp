package project.BackEnd.User;

import lombok.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class UserPayload {
    private Long masterID;
    private String username;
    private String email;
    private String password_hash;


}
