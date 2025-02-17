/**
 * This class defines a field update DTO payload.
 *
 * @author Szymon Bigoszewski
 * @version 1.0
 */
package project.BackEnd.FieldInfo;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UpdatePayload {
    String columnName;
    Long rowIndex;
    String newDataValue;
}
