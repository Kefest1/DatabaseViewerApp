package project.BackEnd.DatabaseInfo;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import project.BackEnd.FieldInfo.FieldInfoRepository;
import project.BackEnd.OwnershipDetails.OwnershipDetails;
import project.BackEnd.Table.TableInfoRepository;
import project.BackEnd.User.UserInfo;

import javax.xml.crypto.Data;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("api/databaseinfo")
@CrossOrigin
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

    @GetMapping("/getStatistics/{database}")
    public DatabaseStatistics getDatabaseStatistics(@PathVariable String database) {
        return getStats();
    }

    @PostMapping("/add")
    public int add(@RequestBody String databaseDescription) {
        // int x = databaseInfoRepository.save(databaseDescription);
        return 0;
    }

    private DatabaseStatistics getStats() {
        DatabaseStatistics databaseStatistics = new DatabaseStatistics();
        databaseStatistics.tableCount = (int)tableInfoRepository.count();
        databaseStatistics.tableStatistics = new LinkedList<>();

        var tableNames = tableInfoRepository.findDistinctTableNames();
        for (String tableName : tableNames)
            databaseStatistics.tableStatistics.add(getTableStatistic(tableName));

        return databaseStatistics;
    }

    private TableStatistics getTableStatistic(String tableName) {
        TableStatistics tableStatistics = new TableStatistics();
        tableStatistics.tableName = tableName;
        Long id = tableInfoRepository.findIdByTableName(tableName);

        tableStatistics.rowCount = fieldInfoRepository.countDistinctColumnIDByColumnId(id);

        tableStatistics.columnCounts = fieldInfoRepository.countDistinctColumnNameByColumnId(id);

        return tableStatistics;
    }

}

class DatabaseStatistics {
    Integer tableCount;
    List<TableStatistics> tableStatistics;
}

class TableStatistics {
    String tableName;
    List<String> rowNames;
    Long rowCount;
    Long columnCounts;
}
