/**
 * This class creates a repository for users.
 *
 * @author Szymon Bigoszewski
 * @version 1.0
 */
package project.BackEnd.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, Long> {

    @Query("SELECT ui FROM UserInfo ui WHERE ui.username = :username")
    UserInfo findByUsername(String username);

    @Query("SELECT ui.admin.username FROM UserInfo ui WHERE ui.username = :username")
    String findAdmin(String username);

    @Query("SELECT ui.admin.email    FROM UserInfo ui WHERE ui.username = :username")
    String findAdminEmail(String username);

    @Query("SELECT ui.id FROM UserInfo ui WHERE ui.username = :username")
    Long findUserIDByUsername(String username);

    @Query("SELECT ui.id FROM UserInfo ui WHERE ui.username = :userName AND ui.password_hash = :password")
    Optional<Long> checkLoginData(@Param("userName") String userName, @Param("password") String password);

    UserInfo findByUsernameAndIsAdmin(String username, boolean isAdmin);
    UserInfo findByEmail(String email);
}
