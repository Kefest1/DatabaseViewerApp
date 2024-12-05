package project.BackEnd.DatabaseInfo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DatabaseInfoRepository extends JpaRepository<DatabaseInfo, Long> {

    @Query("SELECT DISTINCT ti.databaseInfo.databaseName, ti.tableName FROM UserInfo ui JOIN ui.ownershipDetails od JOIN od.tableInfo ti WHERE ui.username = :name ORDER BY 1, 2")
    List<String> findAllUsersTable(@Param("name") String name);

    @Query("SELECT ti.id, ti.tableName, ti.primary_key FROM TableInfo ti JOIN ti.databaseInfo db JOIN ti.ownershipDetails od JOIN od.userInfo ui " +
            "WHERE ui.username = :userName AND db.databaseName = :databaseName")
    List<String> findTablesForDatabase(@Param("userName") String userName, @Param("databaseName") String databaseName);

    long count();

    DatabaseInfo getDatabaseInfoByDatabaseName(String databaseName);

}
