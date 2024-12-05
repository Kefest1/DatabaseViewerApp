package project.BackEnd.DatabaseInfo;


import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import project.BackEnd.FieldInfo.FieldInfoRepository;
import project.BackEnd.OwnershipDetails.OwnershipDetails;
import project.BackEnd.Table.TableInfoRepository;
import project.BackEnd.User.UserInfo;

import javax.xml.crypto.Data;
import java.util.*;

@RestController
@RequestMapping("api/databaseinfo")
@CrossOrigin(origins = "http://localhost:3000")
public class DatabaseInfoController {

    @Autowired
    DatabaseInfoService databaseInfoService;

    @Autowired
    DatabaseInfoRepository databaseInfoRepository;

    @Autowired
    TableInfoRepository tableInfoRepository;

    @Autowired
    FieldInfoRepository fieldInfoRepository;

    @GetMapping("/getall")
    public List<DatabaseInfo> getDatabase() {
        return databaseInfoService.findAll();
    }

    @GetMapping("/getfoldermap/{username}")
    public List<String> getFolderMap(@PathVariable String username) {
        return databaseInfoRepository.findAllUsersTable(username);
    }

    @GetMapping("/getDatabaseStructure/{username}/{databaseName}")
    public List<String> getDatabaseStructure(@PathVariable String databaseName, @PathVariable String username) {
        List<String> databaseStructure = databaseInfoRepository.findTablesForDatabase(username, databaseName);
        List<String> modifiedDatabaseStructure = new ArrayList<>();

        for (String tableKeyPair : databaseStructure) {
            String tableName = tableKeyPair.split(",")[0];

            Integer recordCount = tableInfoRepository.countRecords(databaseName, tableName);
            boolean isEmpty = (recordCount == 0);

            String modifiedTableKeyPair = tableKeyPair + "," + isEmpty;
            modifiedDatabaseStructure.add(modifiedTableKeyPair);
        }

        return modifiedDatabaseStructure;
    }

    @GetMapping("/getStatistics/{database}")  // TODO check database's name
    public DatabaseStatistics getDatabaseStatistics(@PathVariable String database) {
//        return new DatabaseStatistics();
        return getStats();
    }

    @PostMapping("/add/{databaseName}/{databaseDescription}")
    public Long add(@PathVariable("databaseName") String databaseName, @PathVariable("databaseDescription") String databaseDescription) {
        DatabaseInfo databaseInfo = new DatabaseInfo(databaseName, databaseDescription);
        System.out.println(databaseInfo);
        DatabaseInfo savedDatabaseInfo = databaseInfoRepository.save(databaseInfo);
        return savedDatabaseInfo.getId();
    }

    private DatabaseStatistics getStats() {
        DatabaseStatistics databaseStatistics = new DatabaseStatistics();
        databaseStatistics.tableCount = (int)tableInfoRepository.count();
        databaseStatistics.tableStatistics = new LinkedList<>();

        var tableNames = tableInfoRepository.findDistinctTableNames();
        for (String tableName : tableNames) {
            databaseStatistics.tableStatistics.add(getTableStatistic(tableName));
        }

        return databaseStatistics;
    }

    private TableStatistics getTableStatistic(String tableName) {
        TableStatistics tableStatistics = new TableStatistics();

        tableStatistics.tableName = tableName;
        tableStatistics.rowCount = fieldInfoRepository.countDistinctColumnNamesByTableName(tableName);
        tableStatistics.columnCounts = fieldInfoRepository.countDistinctColumnIDByColumnId(tableName);
        tableStatistics.rowNames = fieldInfoRepository.findDistinctColumnNamesByTableName(tableName);

        return tableStatistics;
    }

}

@ToString
@Getter
@Setter
@NoArgsConstructor
class DatabaseStatistics {
    Integer tableCount;
    List<TableStatistics> tableStatistics;
}

@ToString
@Getter
@Setter
@NoArgsConstructor
class TableStatistics {
    String tableName;
    List<String> rowNames;
    Long rowCount;
    Long columnCounts;
}
