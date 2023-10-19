package project.BackEnd.DatabaseInfo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DatabaseInfoRepository extends JpaRepository<DatabaseInfo, Long> {
}
