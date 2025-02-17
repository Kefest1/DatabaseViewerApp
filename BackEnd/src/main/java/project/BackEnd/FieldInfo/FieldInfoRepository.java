/**
 * This class defines a Rest API field repository.
 *
 * @author Szymon Bigoszewski
 * @version 1.0
 */
package project.BackEnd.FieldInfo;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface FieldInfoRepository extends JpaRepository<FieldInfo, Long>, CrudRepository<FieldInfo, Long> {

    @Query("SELECT DISTINCT fi.dataValue, fi.id FROM FieldInfo fi JOIN fi.tableInfo ti JOIN ti.databaseInfo db WHERE ti.tableName = :tableName AND fi.columnName = :columnName AND db.databaseName = :databaseName ORDER BY fi.id")
    List<String> getSingleRow(@Param("tableName") String tableName, @Param("columnName") String columnName, @Param("databaseName") String databaseName);

    @Query("SELECT fi FROM FieldInfo fi JOIN fi.tableInfo ti JOIN ti.databaseInfo db JOIN ti.ownershipDetails od JOIN od.userInfo us " +
           "WHERE us.username = :username AND db.databaseName = :databaseName AND ti.tableName = :tableName AND fi.columnName = :columnName AND fi.dataValue = :dataValue")
    List<FieldInfo> getFieldsByColumnName(
            @Param("databaseName") String databaseName,
            @Param("username") String username,
            @Param("tableName") String tableName,
            @Param("columnName") String columnName,
            @Param("dataValue") String dataValue);

    @Query("SELECT COUNT(DISTINCT fi.columnId) FROM FieldInfo fi JOIN fi.tableInfo ti WHERE ti.tableName = :tableName")
    Long countDistinctColumnIDByColumnId(@Param("tableName") String tableName);

    @Query("SELECT COUNT(DISTINCT fi.columnName) FROM FieldInfo fi JOIN fi.tableInfo ti WHERE ti.tableName = :tableName")
    Long countDistinctColumnNamesByTableName(@Param("tableName") String tableName);

    @Query("SELECT DISTINCT ts.columnType FROM TableInfo ti JOIN ti.tableStructure ts JOIN ti.databaseInfo WHERE ts.columnName = :columnName AND ti.tableName = :tableName")
    List<String> findDatatype(@Param("columnName") String columnName, @Param("tableName") String tableName);


    @Query("SELECT fi.dataValue FROM FieldInfo fi JOIN fi.tableInfo ti WHERE ti.tableName = :tableName AND fi.columnName = :primaryKeyName")
    List<String> findFirstFreeKeyFieldWithUsersAndTables(@Param("tableName") String tableName, @Param("primaryKeyName") String primaryKeyName);

    @Query("SELECT MAX(fi.columnId) + 1 FROM FieldInfo fi")
    Long findMaxColumnID();

    FieldInfo findDistinctFieldInfoByTableInfo_TableNameAndColumnNameAndTableInfo_DatabaseInfo_DatabaseNameAndColumnId(@Param("tableName") String tableName,
                                        @Param("columnName") String columnName,
                                        @Param("databaseName") String databaseName,
                                        @Param("columnId") Long columnId);

    @Modifying
    @Query("UPDATE FieldInfo fi SET fi.dataValue = :dataValue WHERE fi.columnId = :columnId AND fi.columnName = :columnName")
    @Transactional
    Integer updateFieldInfoByColumnIdAndColumnName(@Param("dataValue") String dataValue, @Param("columnId") Long columnId, @Param("columnName") String columnName);

    @Query("SELECT fi.columnId, fi FROM FieldInfo fi JOIN fi.tableInfo ti WHERE ti.tableName = :tableName AND fi.columnName IN :columnNames")
    List<Object[]> findFieldInfoByColumnNameInAndTableName(@Param("columnNames") Collection<String> columnNames, @Param("tableName") String tableName);

    @Query("SELECT fi.columnId, fi FROM FieldInfo fi " +
            "JOIN fi.tableInfo ti JOIN ti.ownershipDetails od JOIN od.userInfo ui " +
            "WHERE ti.tableName = :tableName AND ui.username = :username AND fi.columnName IN :columnNames")
    List<Object[]> findFieldInfoByColumnNameInAndTableNameByUserName(@Param("columnNames") List<String> columnNames,
                                                                     @Param("tableName") String tableName,
                                                                     @Param("username") String username);

    @Query("SELECT fi.columnId, fi FROM FieldInfo fi JOIN fi.tableInfo ti WHERE ti.tableName = :tableName")
    List<Object[]> findFieldInfoTableName( @Param("tableName") String tableName);

    @Modifying
    @Query("DELETE FROM FieldInfo f WHERE f.columnId = :columnId")
    @Transactional
    void deleteByColumnId(@Param("columnId") Long columnId);

}
