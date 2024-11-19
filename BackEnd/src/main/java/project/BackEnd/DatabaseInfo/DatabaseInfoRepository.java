package project.BackEnd.DatabaseInfo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DatabaseInfoRepository extends JpaRepository<DatabaseInfo, Long> {

    @Query("SELECT DISTINCT ti.databaseInfo.databaseName, ti.tableName, fi.columnName FROM UserInfo ui JOIN ui.ownershipDetails od JOIN od.tableInfo ti JOIN ti.fields fi WHERE ui.username = :name ORDER BY 1, 2, 3")
    List<String> findAllUsersTable(@Param("name") String name);

    long count();

}
