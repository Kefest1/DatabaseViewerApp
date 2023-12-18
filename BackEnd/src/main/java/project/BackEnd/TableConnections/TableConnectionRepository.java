package project.BackEnd.TableConnections;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface TableConnectionRepository extends JpaRepository<TableConnection, Long> {
    List<TableConnection> findAll();
}
