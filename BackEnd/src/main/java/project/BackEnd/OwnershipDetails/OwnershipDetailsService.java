/**
 * This class defines a ownership details service interface.
 *
 * @author Szymon Bigoszewski
 * @version 1.0
 */
package project.BackEnd.OwnershipDetails;

import project.BackEnd.Table.TableInfo;
import project.BackEnd.User.UserInfo;

import java.util.List;

public interface OwnershipDetailsService {
    void addOwnershipDetails(OwnershipDetailsPayload ownershipDetailsPayload);

    List<OwnershipDetails> findAll();

    List<OwnershipDetails> findAllWithUserAndTableInfo();



//    List<UserInfo> findAllUsersTable(String name);
}
