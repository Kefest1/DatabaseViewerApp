package project.BackEnd.Table;

import project.BackEnd.OwnershipDetails.OwnershipDetails;

import java.util.List;

public interface TableInfoService {
    List<TableInfo> getAllTableInfo();
    void saveTableInfo(TableInfo tableInfo);
    String getTableNameByID(Long ID);
//    List<String> getByUserName();
}
