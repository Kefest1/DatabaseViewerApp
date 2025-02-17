/**
 * This class defines a ownership details repository.
 *
 * @author Szymon Bigoszewski
 * @version 1.0
 */
package project.BackEnd.OwnershipDetails;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

@Repository
public interface OwnershipDetailsRepository extends JpaRepository<OwnershipDetails, Long> {

    @Modifying
    @Transactional
    Long deleteOwnershipDetailsByUserInfoIdAndTableInfoId(Long userInfoId, Long tableInfoId);
}
