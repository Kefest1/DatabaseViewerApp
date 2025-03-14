/**
 * This class created a Rest API for databaseInfo class.
 *
 * @author Szymon Bigoszewski
 * @version 1.0
 */
package project.BackEnd.DatabaseInfo;

import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.BackEnd.FieldInfo.FieldInfoRepository;
import project.BackEnd.OwnershipDetails.OwnershipDetailsPayload;
import project.BackEnd.OwnershipDetails.OwnershipDetailsService;
import project.BackEnd.Table.TableInfo;
import project.BackEnd.Table.TableInfoRepository;
import project.BackEnd.Table.TableStructure;
import project.BackEnd.Table.TableStructureRepository;
import project.BackEnd.User.UserInfoRepository;
import java.util.*;

@RestController
@RequestMapping("/api/databaseinfo")
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
        return databaseInfoRepository.findAllUsersTableAndColumnNames(username);
    }

    @GetMapping("/getDatabaseIsEmpty/{username}/{databaseName}")
    public ResponseEntity<Boolean> getIsDatabaseEmpty(@PathVariable String username, @PathVariable String databaseName) {
        Boolean isEmpty = databaseInfoRepository.getFieldInfoCount(databaseName, username) == 0L;
        return ResponseEntity.status(HttpStatus.OK).body(isEmpty);
    }

    @GetMapping("/getAvailableDatabaseNames/{userName}")
    public List<String> getAvailableDatabases(@PathVariable("userName") String userName) {
        return databaseInfoRepository.findDatabaseNamesByUsername(userName);
    }

    @DeleteMapping("/delete/{databaseName}/{userName}")
    public ResponseEntity<String> getAvailableDatabases(
            @PathVariable("userName") String userName,
            @PathVariable("databaseName") String databaseName
    ) {
        List<Long> tables = databaseInfoRepository.findTablesIdsForDatabase(userName, databaseName);

        tableStructureRepository.deleteTableStructureByTableInfo_Ids(tables);
        tableInfoRepository.deleteTableInfoByIds(tables);

        return ResponseEntity.status(HttpStatus.OK)
                .body("Success");
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

    @GetMapping("/getStatistics/{databaseName}/{userName}")
    public DatabaseStatisticsDTO getDatabaseStatistics(@PathVariable String databaseName, @PathVariable String userName) {
        return getStats(userName, databaseName);
    }

    @PutMapping("/updateDatabaseDescription/{databaseName}/{userName}")
    public ResponseEntity<String> updateDatabaseDescription(
            @PathVariable String databaseName,
            @PathVariable String userName,
            @RequestBody String databaseDescription
    ) {
        try {
            DatabaseInfo databaseInfo = databaseInfoRepository.findDatabaseInfo(databaseName, userName);
            databaseInfo.setDescription(databaseDescription);
            databaseInfoRepository.save(databaseInfo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to edit database description");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body("Success");
    }

    @PostMapping("/add")
    public ResponseEntity<String> addDatabase(@RequestBody DatabaseRequestPayload payload) {
        List<String> existingDatabaseName = tableInfoRepository.findDatabaseNamesByUserName(payload.getUserName(), payload.getDatabaseName());

        if (!existingDatabaseName.isEmpty()) {
            return new ResponseEntity<>("Database with that name already exists", HttpStatus.OK);
        }

        DatabaseInfo databaseInfo = new DatabaseInfo(payload.getDatabaseName(), payload.getDatabaseDescription());
        DatabaseInfo savedDatabaseInfo = databaseInfoRepository.save(databaseInfo);
        TableInfo tableInfo = new TableInfo(savedDatabaseInfo, payload.getTableName(), payload.getColumnName());
        TableInfo savedTableInfo = tableInfoRepository.save(tableInfo);

        TableStructure tableStructure = new TableStructure(payload.getColumnName(), "Long", savedTableInfo);
        tableStructureRepository.save(tableStructure);

        Long userID = userInfoRepository.findUserIDByUsername(payload.getUserName());
        ownershipDetailsService.addOwnershipDetails(new OwnershipDetailsPayload(userID, savedTableInfo.getId()));

        return new ResponseEntity<>("Success", HttpStatus.CREATED);
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @ToString
    public static class DatabaseRequestPayload {
        private String databaseName;
        private String tableName;
        private String columnName;
        private String userName;
        private String databaseDescription;
    }

    private DatabaseStatisticsDTO getStats(String userName, String databaseName) {
        DatabaseStatisticsDTO databaseStatistics = new DatabaseStatisticsDTO();
        databaseStatistics.tableCount = tableInfoRepository.findCountWithUsersAndTables(userName, databaseName);
        databaseStatistics.databaseDescription = databaseInfoRepository.findDatabaseDescription(userName, databaseName);
        databaseStatistics.tableStatistics = new LinkedList<>();

        List<String> tableNames = tableInfoRepository.findTableInfoAndByUserName(userName, databaseName);
        for (String tableName : tableNames) {
            databaseStatistics.tableStatistics.add(getTableStatistic(tableName, databaseName, userName));
        }

        return databaseStatistics;
    }

    private TableStatisticsDTO getTableStatistic(String tableName, String databaseName, String userName) {
        TableStatisticsDTO tableStatistics = new TableStatisticsDTO();

        tableStatistics.tableName = tableName;
        tableStatistics.rowCount = fieldInfoRepository.countDistinctColumnNamesByTableName(tableName);
        tableStatistics.columnCounts = fieldInfoRepository.countDistinctColumnIDByColumnId(tableName);
        List<TableStructure> tableStructures = tableInfoRepository.findColumnNamesByUserAndDatabaseAndTablenameFromStructure(databaseName, userName, tableName);
        tableStatistics.rowNames = tableStructures.stream()
                .map(ts -> new ColumnsDTO(ts.getColumnName(), ts.getColumnType()))
                .toList();
        return tableStatistics;
    }

}
