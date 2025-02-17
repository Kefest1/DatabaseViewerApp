/**
 * This class defines a ownership details payload.
 *
 * @author Szymon Bigoszewski
 * @version 1.0
 */
package project.BackEnd.OwnershipDetails;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class OwnershipDetailsPayload {
    Long userID;
    Long tableID;
}
