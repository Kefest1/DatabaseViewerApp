/**
 * This class defines a service interface for table information.
 *
 * @author Szymon Bigoszewski
 * @version 1.0
 */
package project.BackEnd.Table;

import java.util.List;

public interface TableInfoService {
    List<TableInfo> getAllTableInfo();
    TableInfo saveTableInfo(TableInfo tableInfo);
    String getTableNameByID(Long ID);
//    List<String> getByUserName();
}
