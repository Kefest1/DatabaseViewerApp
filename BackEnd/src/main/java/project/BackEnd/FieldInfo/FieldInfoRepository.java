package project.BackEnd.FieldInfo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.BackEnd.OwnershipDetails.OwnershipDetails;

import java.util.List;

@Repository
public interface FieldInfoRepository extends JpaRepository<FieldInfo, Long> {
//    List<FieldInfo> getFieldInfosByColumnName(String columnName);
//    @Query("SELECT DISTINCT f.dataType FROM FieldInfo f")
//    List<FieldInfo> getDistinctDataTypes();

    @Query("SELECT DISTINCT fi.column_name, ti.tableName FROM FieldInfo fi JOIN fi.tableInfo ti JOIN fi.tableInfo.ownershipDetails od JOIN od.user WHERE od.user.username = :username")
    List<String> findWithUsersAndTables(@Param("username") String username);

}
