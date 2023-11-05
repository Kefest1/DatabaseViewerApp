package project.BackEnd.DatabaseInfo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import project.BackEnd.OwnershipDetails.OwnershipDetails;

import java.util.List;

@Repository
public interface DatabaseInfoRepository extends JpaRepository<DatabaseInfo, Long> {
//    @Query("SELECT od FROM OwnershipDetails od JOIN FETCH od.user JOIN FETCH od.tableInfo JOIN FETCH od.tableInfo.databaseInfo WHERE od.user.username = :userName")
//    List<OwnershipDetails> findAllDatabaseNamesWithUserAndTableInfo(String userName);
//
//    @Query("SELECT di.databaseName FROM database_info di JOIN FETCH TableInfo JOIN FETCH OwnershipDetails JOIN FETCH UserInfo ui WHERE ui.username = :userName")
//    List<String> test(String userName);
}
