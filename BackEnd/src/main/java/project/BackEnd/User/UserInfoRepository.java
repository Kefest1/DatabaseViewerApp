package project.BackEnd.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, Long> {

    UserInfo findByUsername(String username);
    UserInfo findByUsernameAndIsAdmin(String username, boolean isAdmin);
    UserInfo findByEmail(String email);
    UserInfo getUserInfoById(Long id);

    @Query("SELECT DISTINCT db.databaseName, ti.fields, fd.columnName FROM UserInfo ui JOIN ui.ownershipDetails od JOIN od.tableInfo ti JOIN ti.fields fd JOIN ti.databaseInfo db WHERE ui.username = :name")
    List<String> findAllUsersTable(@Param("name") String name);
}
