package project.BackEnd.DatabaseInfo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface DatabaseInfoRepository extends JpaRepository<DatabaseInfo, Long> {

    long count();

    @Query("SELECT DISTINCT ti.databaseInfo.databaseName, ti.tableName FROM UserInfo ui JOIN ui.ownershipDetails od JOIN od.tableInfo ti WHERE ui.username = :name ORDER BY 1, 2")
    List<String> findAllUsersTable(@Param("name") String name);

    @Query("SELECT DISTINCT ti.databaseInfo.databaseName, ti.tableName, ts.columnName FROM UserInfo ui " +
            "JOIN ui.ownershipDetails od JOIN od.tableInfo ti  JOIN ti.tableStructure ts WHERE ui.username = :name" +
            " ORDER BY 1, 2")
    List<String> findAllUsersTableAndColumnNames(@Param("name") String name);

    @Query("SELECT DISTINCT db.databaseName FROM UserInfo ui " +
            "JOIN ui.ownershipDetails od " +
            "JOIN od.tableInfo ti " +
            "JOIN ti.databaseInfo db " +
            "WHERE ui.username = :userName")
    List<String> findDatabaseNamesByUsername(@Param("userName") String userName);

    @Query("SELECT ti.id, ti.tableName, ti.primary_key FROM TableInfo ti JOIN ti.databaseInfo db JOIN ti.ownershipDetails od JOIN od.userInfo ui " +
            "WHERE ui.username = :userName AND db.databaseName = :databaseName")
    List<String> findTablesForDatabase(@Param("userName") String userName, @Param("databaseName") String databaseName);

    @Query("SELECT DISTINCT db.description FROM TableInfo ti JOIN ti.databaseInfo db JOIN ti.ownershipDetails od JOIN od.userInfo ui " +
            "WHERE ui.username = :userName AND db.databaseName = :databaseName")
    String findDatabaseDescription(@Param("userName") String userName, @Param("databaseName") String databaseName);

    @Query("SELECT DISTINCT ti.databaseInfo FROM TableInfo ti JOIN ti.ownershipDetails od JOIN od.userInfo ui " +
            "WHERE ui.username = :userName AND ti.databaseInfo.databaseName = :databaseName")
    DatabaseInfo findDatabaseInfo(@Param("databaseName") String databaseName, @Param("userName") String userName);

    @Query("SELECT ti.id FROM TableInfo ti JOIN ti.databaseInfo db JOIN ti.ownershipDetails od JOIN od.userInfo ui " +
            "WHERE ui.username = :userName AND db.databaseName = :databaseName")
    List<Long> findTablesIdsForDatabase(@Param("databaseName") String databaseName, @Param("userName") String userName);

    @Modifying
    @Query("DELETE FROM DatabaseInfo db WHERE db.id = :databaseID")
    @Transactional
    void deleteDatabaseInfoById(@Param("databaseID") Long databaseID);

    DatabaseInfo getDatabaseInfoByDatabaseName(String databaseName);
}
