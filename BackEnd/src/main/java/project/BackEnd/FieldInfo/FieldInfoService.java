/**
 * This class defines a field information service interface.
 *
 * @author Szymon Bigoszewski
 * @version 1.0
 */
package project.BackEnd.FieldInfo;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface FieldInfoService {

    List<FieldInfo> getAllFieldInfos();
//    List<FieldInfo> getAllFieldInfosByColumnName(String columnName);
    List<String> getDataTypes();

}
