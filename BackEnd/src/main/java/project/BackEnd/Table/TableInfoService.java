package project.BackEnd.Table;

import java.util.List;

public interface TableInfoService {
    List<TableInfo> getAllTableInfo();
    TableInfo saveTableInfo(TableInfo tableInfo);
    String getTableNameByID(Long ID);
//    List<String> getByUserName();
}
