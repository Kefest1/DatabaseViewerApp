package project.BackEnd.FieldInfo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FieldInfoRepository extends JpaRepository<FieldInfo, Long> {
    List<FieldInfo> getFieldInfosByColumnName(String columnName);
    @Query("SELECT DISTINCT f.dataType FROM FieldInfo f")
    List<FieldInfo> getDistinctDataTypes();
}
