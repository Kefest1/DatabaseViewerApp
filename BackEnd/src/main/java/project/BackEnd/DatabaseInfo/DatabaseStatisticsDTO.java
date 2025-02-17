/**
 * This class defines a database information DTO(data transfer object).
 *
 * @author Szymon Bigoszewski
 * @version 1.0
 */
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
public class DatabaseStatisticsDTO {
    Long tableCount;
    String databaseDescription;
    List<TableStatisticsDTO> tableStatistics;
}