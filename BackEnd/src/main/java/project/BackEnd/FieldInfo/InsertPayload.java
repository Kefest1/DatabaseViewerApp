/**
 * This class defines a field information DTO payload.
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
public class InsertPayload {
    String columnName;
    String dataValue;
    String tableName;
    Long localID;
}
