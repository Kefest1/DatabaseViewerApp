package project.BackEnd.DatabaseInfo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.BackEnd.OwnershipDetails.OwnershipDetails;

import java.util.List;

@Repository
public interface DatabaseInfoRepository extends JpaRepository<DatabaseInfo, Long> {

    @Query("SELECT DISTINCT db.databaseName, tb.tableName, fd.columnName FROM database_info db JOIN db.tables tb JOIN tb.ownershipDetails od JOIN od.user JOIN tb.fields fd WHERE od.user.username = :name ORDER BY 1, 2, 3")
    List<String> findAllUsersTable(@Param("name") String name);
}
