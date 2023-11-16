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
