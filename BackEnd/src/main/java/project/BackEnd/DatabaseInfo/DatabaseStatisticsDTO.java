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
class DatabaseStatisticsDTO {
    Long tableCount;
    List<TableStatisticsDTO> tableStatistics;
}