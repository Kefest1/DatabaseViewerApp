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

    @Query("SELECT ui.id FROM UserInfo ui WHERE ui.username = :username")
    Long findUserIDByUsername(String username);

    @Query("SELECT ui.id FROM UserInfo ui WHERE ui.username = :userName AND ui.password_hash = :password")
    Optional<Long> checkLoginData(@Param("userName") String userName, @Param("password") String password);

    UserInfo findByUsernameAndIsAdmin(String username, boolean isAdmin);
    UserInfo findByEmail(String email);
    UserInfo getUserInfoById(Long id);

    @Query("SELECT DISTINCT db.databaseName, ti.fields, fd.columnName FROM UserInfo ui JOIN ui.ownershipDetails od JOIN od.tableInfo ti JOIN ti.fields fd JOIN ti.databaseInfo db WHERE ui.username = :name")
    List<String> findAllUsersTable(@Param("name") String name);

}
