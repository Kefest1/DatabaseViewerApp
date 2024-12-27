package project.BackEnd.DatabaseInfo;


import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.BackEnd.FieldInfo.FieldInfoRepository;
import project.BackEnd.OwnershipDetails.OwnershipDetails;
import project.BackEnd.OwnershipDetails.OwnershipDetailsPayload;
import project.BackEnd.OwnershipDetails.OwnershipDetailsService;
import project.BackEnd.Table.TableInfo;
import project.BackEnd.Table.TableInfoRepository;
import project.BackEnd.Table.TableStructure;
import project.BackEnd.Table.TableStructureRepository;
import project.BackEnd.User.UserInfo;
import project.BackEnd.User.UserInfoRepository;

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

    @Autowired
    TableStructureRepository tableStructureRepository;

    @Autowired
    UserInfoRepository userInfoRepository;

    @Autowired
    OwnershipDetailsService ownershipDetailsService;

    @GetMapping("/getall")
    public List<DatabaseInfo> getDatabase() {
        return databaseInfoService.findAll();
    }

    @GetMapping("/getfoldermap/{username}")
    public List<String> getFolderMap(@PathVariable String username) {
        return databaseInfoRepository.findAllUsersTable(username);
    }

    @GetMapping("/getAvailableDatabaseNames/{userName}")
    public List<String> getAvailableDatabases(@PathVariable("userName") String userName) {
        return databaseInfoRepository.findDatabaseNamesByUsername(userName);
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

    @PostMapping("/add/{databaseName}/{tableName}/{columnName}/{databaseDescription}/{userName}")
    public ResponseEntity<String> add(
            @PathVariable("databaseName") String databaseName,
            @PathVariable("databaseDescription") String databaseDescription,
            @PathVariable("columnName") String columnName,
            @PathVariable("tableName") String tableName,
            @PathVariable("userName") String userName
    ) {
        var existingDatabaseName = tableInfoRepository.findDatabaseNamesByUserName(userName);
        System.out.println(databaseName);
        System.out.println(existingDatabaseName);
        if (existingDatabaseName != null) {
            return new ResponseEntity<>("Database with that name already exists", HttpStatus.OK);
        }

        DatabaseInfo databaseInfo = new DatabaseInfo(databaseName, databaseDescription);
        DatabaseInfo savedDatabaseInfo = databaseInfoRepository.save(databaseInfo);
        TableInfo tableInfo = new TableInfo(savedDatabaseInfo, tableName, columnName);

        TableInfo savedTableInfo = tableInfoRepository.save(tableInfo);
        TableStructure tableStructure = new TableStructure(columnName, "Long", savedTableInfo);

        tableStructureRepository.save(tableStructure);

        Long userID = userInfoRepository.findUserIDByUsername(userName);
        ownershipDetailsService.addOwnershipDetails(new OwnershipDetailsPayload(userID, savedTableInfo.getId()));

        return new ResponseEntity<>("Success", HttpStatus.OK);
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
