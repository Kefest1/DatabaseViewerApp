package project.BackEnd.DatabaseInfo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import project.BackEnd.OwnershipDetails.OwnershipDetails;

import java.util.List;

@Repository
public interface DatabaseInfoRepository extends JpaRepository<DatabaseInfo, Long> {
}
