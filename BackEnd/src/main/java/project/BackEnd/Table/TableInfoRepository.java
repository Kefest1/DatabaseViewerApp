package project.BackEnd.Table;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.BackEnd.OwnershipDetails.OwnershipDetails;

import java.util.List;

@Repository
public interface TableInfoRepository extends JpaRepository<TableInfo, Long>, CrudRepository<TableInfo, Long> {
//    @Query("SELECT od FROM OwnershipDetails od " +
//            "INNER JOIN od.tables " +
//            "INNER JOIN od.users us " +
//            "WHERE us.username = :username")
//    List<TableInfo> findTablesByUserUsername(@Param("username") String username);

    TableInfo getTableInfoById(Long id);

    @Query("SELECT ti FROM TableInfo ti JOIN FETCH ti.ownershipDetails od JOIN FETCH od.user")
    List<TableInfo> findWithUsersAndTables();

    @Query("SELECT ti.tableName FROM TableInfo ti")
    List<String> findDistinctTableNames();
}
