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

    @Query("SELECT DISTINCT fi.dataType FROM FieldInfo fi JOIN fi.tableInfo ti WHERE fi.columnName = :columnName AND ti.tableName = :tableName")
    String findTopDataTypeByColumnNameOrdered(@Param("columnName") String columnName, @Param("tableName") String tableName);

//    @Query("SELECT DISTINCT fi.columnName, ti.tableName FROM FieldInfo fi JOIN fi.tableInfo ti JOIN fi.tableInfo.ownershipDetails od JOIN od.user WHERE od.user.username = :username")
//    List<String> findWithUsersAndTables(@Param("username") String username);

    @Query("SELECT fi FROM FieldInfo fi JOIN fi.tableInfo ti WHERE ti.tableName = :tableName AND fi.columnName = :columnName AND fi.dataValue = :dataValue")
    FieldInfo findFieldWithUsersAndTables(@Param("tableName") String tableName, @Param("columnName") String columnName, @Param("dataValue") String dataValue);

    FieldInfo findByColumnNameAndTableInfo_TableNameAndDataValue(String columnName, String tableName, String dataValue);

    @Query("SELECT fi.columnId, fi FROM FieldInfo fi JOIN fi.tableInfo ti WHERE ti.tableName = :tableName AND fi.columnName IN :columnNames")
    List<Object[]> findFieldInfoByColumnNameInAndTableName(@Param("columnNames") Collection<String> columnNames, @Param("tableName") String tableName);


    @Transactional
    default void updateFieldInfo(String columnName, String tableName, String oldDataValue, String newDataValue) {
        FieldInfo existingFieldInfo = findByColumnNameAndTableInfo_TableNameAndDataValue(columnName, tableName, oldDataValue);

        if (existingFieldInfo != null) {
            existingFieldInfo.setDataValue(newDataValue);
            save(existingFieldInfo);
        } else {

        }
    }

    FieldInfo findByIdAndColumnNameAndTableInfo_TableName(Long id, String columnName, String tableName);

    @Transactional
    default void deleteFieldInfo(String dataValue, String columnName, String tableName) {
        FieldInfo fieldInfoToDelete = findFieldWithUsersAndTables(tableName, columnName, dataValue);
        System.out.println(fieldInfoToDelete);
        if (fieldInfoToDelete != null) {
            System.out.println("Here");
            delete(fieldInfoToDelete);
        } else {

        }
    }

}
