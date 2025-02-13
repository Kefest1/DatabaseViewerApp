package project.BackEnd.OwnershipDetails;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

@Repository
public interface OwnershipDetailsRepository extends JpaRepository<OwnershipDetails, Long> {

//    @Query("SELECT od FROM OwnershipDetails od JOIN FETCH od.tableInfo t JOIN FETCH od.user u")
//    @Query("SELECT od FROM OwnershipDetails od JOIN FETCH od.tableInfo JOIN FETCH od.user WHERE od.user.id = :id")
//    List<OwnershipDetails> findWithUsersAndTables(Long id);


    @Modifying
    @Transactional
    Long deleteOwnershipDetailsByUserInfoIdAndTableInfoId(Long userInfoId, Long tableInfoId);
//
//    @Query("SELECT od FROM OwnershipDetails od LEFT JOIN FETCH od.tables t")
//    List<OwnershipDetails> findWithTables();
//
//    @Query("SELECT od FROM OwnershipDetails od")
//    List<OwnershipDetails> findWithUsers();

//    @Query("SELECT od FROM OwnershipDetails od JOIN FETCH od.user JOIN FETCH od.tableInfo")
//    List<OwnershipDetails> findAllWithUserAndTableInfo();
//
//    @Query("SELECT od FROM OwnershipDetails od JOIN FETCH od.user JOIN FETCH od.tableInfo tab WHERE od.user.username = :name")
//    List<OwnershipDetails> findAllUsersTable(String name);
//
//    @Query("SELECT od FROM OwnershipDetails od JOIN FETCH od.user JOIN FETCH od.tableInfo")
//    List<OwnershipDetails> testquery(String name);

}
