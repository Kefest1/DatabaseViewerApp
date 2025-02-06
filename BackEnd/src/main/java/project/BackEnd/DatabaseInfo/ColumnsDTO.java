package project.BackEnd.DatabaseInfo;

import lombok.*;

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
class ColumnsDTO {
    String columnName;
    String columnType;
}
