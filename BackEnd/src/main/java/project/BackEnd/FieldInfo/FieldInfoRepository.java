package project.BackEnd.FieldInfo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FieldInfoRepository extends JpaRepository<FieldInfo, Long> {

}
