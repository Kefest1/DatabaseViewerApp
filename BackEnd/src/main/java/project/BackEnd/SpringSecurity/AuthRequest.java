/**
 * This class creates a payload for user's authentication.
 *
 * @author Szymon Bigoszewski
 * @version 1.0
 */
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