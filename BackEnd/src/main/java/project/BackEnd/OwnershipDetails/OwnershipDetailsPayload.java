package project.BackEnd.OwnershipDetails;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class OwnershipDetailsPayload {
    OwnershipDetails ownershipDetails;
    Long userID;
    Long tableID;
}
