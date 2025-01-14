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

    @Query("SELECT DISTINCT fi.dataValue FROM FieldInfo fi JOIN fi.tableInfo ti JOIN ti.databaseInfo db WHERE ti.tableName = :tableName AND fi.columnName = :columnName AND db.databaseName = :databaseName")
    List<String> getSingleRow(@Param("tableName") String tableName, @Param("columnName") String columnName, @Param("databaseName") String databaseName);

    @Query("SELECT DISTINCT fi.dataValue FROM FieldInfo fi " +
            "JOIN fi.tableInfo ti " +
            "JOIN ti.databaseInfo db " +
            "JOIN ti.tableStructure ts " +
            "WHERE ti.tableName = :tableName " +
            "AND fi.columnName = :columnName " +
            "AND db.databaseName = :databaseName " +
            "AND (ts.columnType = 'Long' OR ts.columnType = 'Numeric' OR ts.columnType = 'Integer')")
    List<String> getSingleRowForNumeric(@Param("tableName") String tableName,
                                        @Param("columnName") String columnName,
                                        @Param("databaseName") String databaseName);

    @Query("SELECT fi FROM FieldInfo fi JOIN fi.tableInfo ti JOIN ti.databaseInfo db JOIN ti.ownershipDetails od JOIN od.userInfo us WHERE us.username = :username AND db.databaseName = :databasename AND ti.tableName = :tablename")
    List<FieldInfo> getFields(@Param("databasename") String databasename, @Param("username") String username, @Param("tablename") String tablename);

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

    @Query("SELECT DISTINCT fi.columnName FROM FieldInfo fi JOIN fi.tableInfo ti WHERE ti.tableName = :tableName")
    List<String> findDistinctColumnNamesByTableName(@Param("tableName") String tableName);

    @Query("SELECT DISTINCT fi.dataType FROM FieldInfo fi JOIN fi.tableInfo ti WHERE fi.columnName = :columnName AND ti.tableName = :tableName")
    List<String> findTopDataTypeByColumnNameOrdered(@Param("columnName") String columnName, @Param("tableName") String tableName);

//    @Query("SELECT DISTINCT fi.columnName, ti.tableName FROM FieldInfo fi JOIN fi.tableInfo ti JOIN fi.tableInfo.ownershipDetails od JOIN od.user WHERE od.user.username = :username")
//    List<String> findWithUsersAndTables(@Param("username") String username);

    @Query("SELECT fi.dataValue FROM FieldInfo fi JOIN fi.tableInfo ti WHERE ti.tableName = :tableName AND fi.columnName = :primaryKeyName")
    List<String> findFirstFreeKeyFieldWithUsersAndTables(@Param("tableName") String tableName, @Param("primaryKeyName") String primaryKeyName);

    @Query("SELECT MAX(fi.columnId) + 1 FROM FieldInfo fi")
    Long findMaxColumnID();

    FieldInfo findByColumnNameAndTableInfo_TableNameAndDataValue(String columnName, String tableName, String dataValue);

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

    @Query("SELECT fi.columnId, fi FROM FieldInfo fi JOIN fi.tableInfo ti WHERE ti.tableName = :tableName")
    List<Object[]> findFieldInfoTableName( @Param("tableName") String tableName);

    @Modifying
    @Query("DELETE FROM FieldInfo f WHERE f.columnId = :columnId")
    @Transactional
    void deleteByColumnId(@Param("columnId") Long columnId);

    @Modifying
    @Query("DELETE FROM FieldInfo f WHERE f.columnId IN (:columnIds)")
    @Transactional
    void deleteByColumnIds(@Param("columnIds") List<Long> columnIds);

}
