package project.BackEnd.TableConnections;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface TableConnectionRepository extends JpaRepository<TableConnection, Long> {
    List<TableConnection> findAll();

    @Query("SELECT tc FROM TableConnection tc WHERE tc.one.id = :id")
    List<TableConnection> getConnectedTablesOne(@Param("id") Long id);

    @Query("SELECT tc FROM TableConnection tc WHERE tc.many.id = :id")
    List<TableConnection> getConnectedTablesMany(@Param("id") Long id);
}
