package project.BackEnd.FieldInfo;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UpdatePayload {
    String columnName;
    String tableName;
    String oldDataValue;
    String newDataValue;
}
