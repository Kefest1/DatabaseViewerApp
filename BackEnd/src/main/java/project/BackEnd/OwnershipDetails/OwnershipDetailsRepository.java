package project.BackEnd.OwnershipDetails;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OwnershipDetailsRepository extends JpaRepository<OwnershipDetails, Long> {
    @Query("SELECT od FROM OwnershipDetails od JOIN FETCH od.user JOIN FETCH od.tableInfo")
    List<OwnershipDetails> findAllWithUserAndTableInfo();
}
