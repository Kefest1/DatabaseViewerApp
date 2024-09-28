package project.BackEnd.Table;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.BackEnd.FieldInfo.FieldInfo;

import java.util.List;

@Repository
public interface TableInfoRepository extends JpaRepository<TableInfo, Long>, CrudRepository<TableInfo, Long> {

    TableInfo getTableInfoById(Long id);

    TableInfo getTableInfoByTableName(String tableName);

    @Query("SELECT ti.id FROM TableInfo ti WHERE ti.tableName = :tableName")
    Long getTableIdByTableName(@Param("tableName") String tableName);

    TableInfo findByTableName(String tableName);

    @Query("SELECT t.id FROM TableInfo t WHERE t.tableName = :tableName")
    Long findIdByTableName(@Param("tableName") String tableName);

    @Query("SELECT t.id FROM TableInfo t JOIN t.databaseInfo db WHERE t.tableName = :tableName AND db.databaseName = :databaseName")
    TableInfo findInstanceByTableNameAndDatabaseName(@Param("tableName") String tableName, @Param("databaseName") String databaseName);

    long count();

    @Query("SELECT ti FROM TableInfo ti JOIN FETCH ti.ownershipDetails od JOIN FETCH od.userInfo")
    List<TableInfo> findWithUsersAndTables();

    @Query("SELECT DISTINCT ti.id " +
            "FROM TableInfo ti JOIN ti.databaseInfo db JOIN ti.ownershipDetails od JOIN od.userInfo WHERE od.userInfo.username = :username AND db.databaseName = :databasename")
    List<Long> findAvailableTables(@Param("databasename") String databasename, @Param("username") String username);

    @Query("SELECT ti.tableName FROM TableInfo ti")
    List<String> findDistinctTableNames();

    @Query("SELECT DISTINCT db.databaseName FROM TableInfo ti JOIN ti.databaseInfo db JOIN ti.ownershipDetails od JOIN od.userInfo WHERE od.userInfo.username = :username")
    List<String> findDatabasesByUserName(@Param("username") String username);

    @Query("SELECT DISTINCT ti.id FROM TableInfo ti JOIN ti.ownershipDetails od JOIN od.userInfo WHERE od.userInfo.username = :username")
    List<Long> findTableInfoByUserName(@Param("username") String username);

    @Query("SELECT DISTINCT ti.tableName, db.databaseName, od.accessLevel FROM TableInfo ti JOIN ti.databaseInfo JOIN ti.ownershipDetails od JOIN od.userInfo JOIN ti.databaseInfo db WHERE od.userInfo.username = :username")
    List<String> findTableInfoAndDatabasesByUserName(@Param("username") String username);

    @Query("SELECT DISTINCT ti.tableName FROM TableInfo ti JOIN ti.databaseInfo db JOIN ti.ownershipDetails od JOIN od.userInfo WHERE od.userInfo.username = :username AND db.databaseName = :databasename")
    List<String> findDatabasesByUserNameAndUsername(@Param("databasename") String databasename, @Param("username") String username);

    @Query("SELECT DISTINCT fi.columnName FROM TableInfo ti JOIN ti.databaseInfo db JOIN ti.ownershipDetails od JOIN od.userInfo JOIN ti.fields fi WHERE od.userInfo.username = :username AND db.databaseName = :databasename AND ti.tableName = :tablename")
    List<String> findColumnNamesByUserAndDatabaseAndTablename(@Param("databasename") String databasename, @Param("username") String username, @Param("tablename") String tablename);

    @Query("SELECT fi FROM FieldInfo fi JOIN fi.tableInfo ti JOIN ti.databaseInfo db JOIN ti.ownershipDetails od JOIN od.userInfo us WHERE us.username = :username AND db.databaseName = :databasename AND ti.tableName = :tablename")
    List<FieldInfo> getFields(@Param("databasename") String databasename, @Param("username") String username, @Param("tablename") String tablename);

    @Query("SELECT fi FROM FieldInfo fi JOIN fi.tableInfo ti JOIN ti.databaseInfo db JOIN ti.ownershipDetails od WHERE db.databaseName = :databasename AND ti.tableName = :tablename AND fi.columnName IN (:columnNames)")
    List<FieldInfo> getFields(@Param("databasename") String databasename, @Param("tablename") String tablename, @Param("columnNames") List<String> columnNames);
}
