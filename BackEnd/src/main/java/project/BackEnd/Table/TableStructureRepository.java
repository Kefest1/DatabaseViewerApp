package project.BackEnd.Table;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TableStructureRepository extends JpaRepository<TableStructure, Long> {

    @Modifying
    @Transactional
    void deleteById(Long id);

    List<TableStructure> getTableStructuresByColumnName(String columnName);

    @Query("SELECT ts FROM TableInfo ti JOIN ti.tableStructure ts JOIN ti.ownershipDetails od JOIN od.userInfo ui " +
            "WHERE ts.columnName = :columnName AND ti.tableName = :tableName AND ui.username = :userName")
    TableStructure findTableStructuresByColumnNameAndTableName(@Param("columnName") String columnName, @Param("tableName") String tableName, @Param("userName") String userName);


    @Modifying
    @Transactional
    @Query("DELETE FROM TableStructure ts WHERE ts.tableInfo.id = :id")
    void deleteTableStructureByTableInfo(Long id);

}
