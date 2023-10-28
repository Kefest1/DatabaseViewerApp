package project.BackEnd.OwnershipDetails;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import project.BackEnd.User.UserInfo;

import java.util.List;

@Repository
public interface OwnershipDetailsRepository extends JpaRepository<OwnershipDetails, Long>  {
    @Query("SELECT od FROM OwnershipDetails od JOIN FETCH od.user JOIN FETCH od.tableInfo")
    List<OwnershipDetails> findAllWithUserAndTableInfo();

    @Query("SELECT od FROM OwnershipDetails od JOIN FETCH od.user JOIN FETCH od.tableInfo tab WHERE od.user.username = :name")
    List<OwnershipDetails> findAllUsersTable(String name);

    @Query("SELECT od FROM OwnershipDetails od JOIN FETCH od.user JOIN FETCH od.tableInfo")
    List<OwnershipDetails> testquery(String name);

}
