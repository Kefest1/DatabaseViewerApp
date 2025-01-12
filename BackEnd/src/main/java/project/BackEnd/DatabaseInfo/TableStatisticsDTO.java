package project.BackEnd.DatabaseInfo;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@ToString
@Getter
@Setter
@NoArgsConstructor
class TableStatisticsDTO {
    String tableName;
    List<ColumnsDTO> rowNames;
    Long rowCount;
    Long columnCounts;
}