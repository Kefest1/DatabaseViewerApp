/**
 * This class creates a database information service interface.
 *
 * @author Szymon Bigoszewski
 * @version 1.0
 */
package project.BackEnd.DatabaseInfo;
import java.util.List;


public interface DatabaseInfoService {
    List<DatabaseInfo> findAll();
}
