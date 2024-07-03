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
