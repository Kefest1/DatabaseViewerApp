package project.BackEnd.Table;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TableStructureRepository extends JpaRepository<TableStructure, Long> {
    // You can add custom query methods here if needed

    void deleteById(Long id);
}
