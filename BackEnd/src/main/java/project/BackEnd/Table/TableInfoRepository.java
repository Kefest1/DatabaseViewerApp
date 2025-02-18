/**
 * This class defines a repository for table information.
 *
 * @author Szymon Bigoszewski
 * @version 1.0
 */
package project.BackEnd.Table;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import project.BackEnd.DatabaseInfo.DatabaseInfo;
import project.BackEnd.FieldInfo.FieldInfo;

import java.util.List;
import java.util.Optional;

@Repository
public interface TableInfoRepository extends JpaRepository<TableInfo, Long>, CrudRepository<TableInfo, Long> {

    TableInfo getTableInfoById(Long id);

    TableInfo getTableInfoByTableName(String tableName);

    @Query("SELECT ti.id FROM TableInfo ti WHERE ti.tableName = :tableName")
    Long getTableIdByTableName(@Param("tableName") String tableName);

    TableInfo findByTableName(String tableName);

    @Query("SELECT t FROM TableInfo t JOIN t.databaseInfo db WHERE db.databaseName = :databaseName")
    List<TableInfo> getTableStructure(@Param("databaseName") String databaseName);

    @Query("SELECT DISTINCT t FROM TableInfo t JOIN t.databaseInfo db WHERE t.tableName = :tableName AND db.databaseName = :databaseName")
    TableInfo findTableInstanceByTableNameAndDatabaseName(@Param("tableName") String tableName, @Param("databaseName") String databaseName);

    @Query("SELECT t FROM TableInfo t JOIN t.databaseInfo db JOIN t.ownershipDetails od JOIN od.userInfo ui" +
            " WHERE t.tableName = :tableName AND db.databaseName = :databaseName AND ui.username = :userName")
    TableInfo findTableInstanceByTableNameAndDatabaseNameAndUserName(@Param("tableName") String tableName,
                                                                     @Param("databaseName") String databaseName,
                                                                     @Param("userName") String userName);

    @Query("SELECT t.primary_key FROM TableInfo t JOIN t.databaseInfo db JOIN t.ownershipDetails od JOIN od.userInfo ui WHERE" +
            " t.tableName = :tableName AND db.databaseName = :databaseName AND ui.username = :userName")
    String findKeyNameByTable(@Param("tableName") String tableName, @Param("databaseName") String databaseName, @Param("userName") String userName);

    long count();

    @Query("SELECT ti FROM TableInfo ti JOIN FETCH ti.ownershipDetails od JOIN FETCH od.userInfo")
    List<TableInfo> findWithUsersAndTables();

    @Query("SELECT COUNT(ti) FROM TableInfo ti JOIN ti.ownershipDetails od JOIN od.userInfo ui JOIN ti.databaseInfo db WHERE ui.username = :userName AND db.databaseName = :databaseName")
    Long findCountWithUsersAndTables(@Param("userName") String userName, @Param("databaseName") String databaseName);

    @Query("SELECT DISTINCT ti.id " +
            "FROM TableInfo ti JOIN ti.databaseInfo db JOIN ti.ownershipDetails od JOIN od.userInfo WHERE od.userInfo.username = :username AND db.databaseName = :databaseName")
    List<Long> findAvailableTables(@Param("databaseName") String databaseName, @Param("username") String username);

    @Query("SELECT DISTINCT ti.tableName " +
            "FROM TableInfo ti JOIN ti.databaseInfo db JOIN ti.ownershipDetails od JOIN od.userInfo WHERE od.userInfo.username = :username AND db.databaseName = :databaseName")
    List<String> findAvailableTableNames(@Param("databaseName") String databaseName, @Param("username") String username);

    @Query("SELECT ti.tableName FROM TableInfo ti")
    List<String> findDistinctTableNames();

    @Query("SELECT DISTINCT db.databaseName FROM TableInfo ti JOIN ti.databaseInfo db JOIN ti.ownershipDetails od JOIN od.userInfo WHERE od.userInfo.username = :username")
    List<String> findDatabasesByUserName(@Param("username") String username);

    @Query("SELECT DISTINCT db FROM TableInfo ti JOIN ti.databaseInfo db JOIN ti.ownershipDetails od JOIN od.userInfo WHERE od.userInfo.username = :username")
    List<DatabaseInfo> findDatabasesObjectsByUserName(@Param("username") String username);

    @Query("SELECT DISTINCT ti.tableName FROM TableInfo ti JOIN ti.ownershipDetails od JOIN od.userInfo JOIN ti.databaseInfo db WHERE od.userInfo.username = :username AND db.databaseName = :databaseName")
    List<String> findTableInfoAndByUserName(@Param("username") String username, @Param("databaseName") String databaseName);

    @Query("SELECT DISTINCT db.databaseName FROM TableInfo ti JOIN ti.ownershipDetails od JOIN od.userInfo JOIN ti.databaseInfo db WHERE od.userInfo.username = :username AND db.databaseName = :databaseName")
    List<String> findDatabaseNamesByUserName(@Param("username") String username, @Param("databaseName") String databaseName);

    @Query("SELECT DISTINCT ti.tableName, db.databaseName, od.accessLevel FROM TableInfo ti JOIN ti.databaseInfo JOIN ti.ownershipDetails od JOIN od.userInfo JOIN ti.databaseInfo db WHERE od.userInfo.username = :username")
    List<String> findTableInfoAndDatabasesByUserName(@Param("username") String username);

    @Query("SELECT DISTINCT ti.tableName FROM TableInfo ti JOIN ti.databaseInfo db JOIN ti.ownershipDetails od JOIN od.userInfo WHERE od.userInfo.username = :username AND db.databaseName = :databaseName")
    List<String> findDatabasesByUserNameAndUsername(@Param("databaseName") String databaseName, @Param("username") String username);

    @Query("SELECT DISTINCT ti.tableStructure FROM TableInfo ti JOIN ti.databaseInfo db JOIN ti.ownershipDetails od JOIN od.userInfo WHERE od.userInfo.username = :username AND db.databaseName = :databaseName AND ti.tableName = :tablename")
    List<TableStructure> findColumnNamesByUserAndDatabaseAndTablenameFromStructure(@Param("databaseName") String databaseName, @Param("username") String username, @Param("tablename") String tablename);

    @Query("SELECT DISTINCT ti.id FROM TableInfo ti JOIN ti.databaseInfo db JOIN ti.ownershipDetails od JOIN od.userInfo WHERE od.userInfo.username = :username AND db.databaseName = :databaseName AND ti.tableName = :tablename")
    Optional<Long> checkIfTableExists(@Param("databaseName") String databaseName, @Param("username") String username, @Param("tablename") String tablename);

    @Query("SELECT fi FROM FieldInfo fi JOIN fi.tableInfo ti JOIN ti.databaseInfo db JOIN ti.ownershipDetails od JOIN od.userInfo us WHERE us.username = :username AND db.databaseName = :databaseName AND ti.tableName = :tablename")
    List<FieldInfo> getFields(@Param("databaseName") String databaseName, @Param("username") String username, @Param("tablename") String tablename);

    @Query("SELECT DISTINCT ti.id FROM TableInfo ti JOIN ti.databaseInfo db JOIN ti.ownershipDetails od JOIN od.userInfo us WHERE od.userInfo.username = :username AND db.databaseName = :databaseName AND ti.tableName = :tablename")
    Long getTableInfoID(@Param("databaseName") String databaseName, @Param("username") String username, @Param("tablename") String tablename);

    @Query("SELECT DISTINCT fi.columnName, fi.dataType FROM FieldInfo fi JOIN fi.tableInfo ti JOIN ti.databaseInfo db WHERE db.databaseName = :databaseName AND ti.tableName = :tablename")
    List<String> getTableInformation(@Param("databaseName") String databaseName, @Param("tablename") String tablename);

    @Query("SELECT COUNT(fi.id) FROM TableInfo ti JOIN ti.databaseInfo db JOIN ti.fields fi WHERE db.databaseName = :databaseName AND ti.tableName = :tableName")
    Long getFieldCount(@Param("databaseName") String databaseName, @Param("tableName") String tableName);

    @Query("SELECT COUNT(fi) FROM TableInfo ti JOIN ti.databaseInfo db JOIN ti.fields fi WHERE ti.tableName = :tableName AND db.databaseName = :databaseName")
    Integer countRecords(@Param("databaseName") String databaseName, @Param("tableName") String tableName);
    
    @Modifying
    @Query("DELETE FROM TableInfo ti WHERE ti.id IN (:tableIds)")
    @Transactional
    void deleteTableInfoByIds(@Param("tableIds") List<Long> tableIds);

    @Modifying
    @Query("DELETE FROM TableInfo ti WHERE ti.id = :tableId")
    @Transactional
    void deleteTableInfoById(@Param("tableId") Long tableId);


    @Query("SELECT ti.id FROM TableInfo ti JOIN ti.ownershipDetails od JOIN od.userInfo ui JOIN ti.databaseInfo di" +
            " WHERE ui.username = :userName AND ti.tableName = :tableName AND di.databaseName = :databaseName")
    Optional<Long> findWithUsersAndTables(@Param("userName") String userName, @Param("tableName") String tableName, @Param("databaseName") String databaseName);
}
