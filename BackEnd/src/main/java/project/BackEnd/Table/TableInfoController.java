package project.BackEnd.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import project.BackEnd.FieldInfo.FieldInfo;
import project.BackEnd.FieldInfo.FieldInfoRepository;
import project.BackEnd.OwnershipDetails.OwnershipDetails;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tableinfo")
@CrossOrigin(origins = "http://localhost:3000")
public class TableInfoController {

    @Autowired
    TableInfoService tableInfoService;

    @Autowired
    TableInfoRepository tableInfoRepository;

    @Autowired
    FieldInfoRepository fieldInfoRepository;

    @GetMapping("/getall")
    public List<TableInfo> getAllTableInfos() {
        return tableInfoService.getAllTableInfo();
    }

    @PostMapping("/add")
    public String saveInfo(@RequestParam("userInfo") TableInfo tableInfo) {
        tableInfoService.saveTableInfo(tableInfo);
        return "OK";
    }

    @GetMapping("/getAvailableDatabases/{username}")
    public List<String> getAvailableTablesByUserName(@PathVariable("username") String userName) {
        return tableInfoRepository.findDatabasesByUserName(userName);
    }

    @GetMapping("/getalljoined")
    public List<TableInfo> getAllODJoined() {
        return tableInfoRepository.findWithUsersAndTables();
    }

    @GetMapping("/getalltablenames")
    public List<String> getAllTableNames() {
        return tableInfoRepository.findDistinctTableNames();
    }

    @GetMapping("/getTables/{user}/{databasename}")
    public List<String> getTablesForUserAndDatabase(@PathVariable("user") String userName, @PathVariable("databasename") String databaseName) {
        return tableInfoRepository.findDatabasesByUserNameAndUsername(databaseName, userName);
    }

    @GetMapping("/getColumns/{user}/{databasename}/{tablename}")
    public List<String> getTablesForUserAndDatabase(@PathVariable("user") String userName, @PathVariable("databasename") String databaseName, @PathVariable("tablename") String tablename) {
        return tableInfoRepository.findColumnNamesByUserAndDatabaseAndTablename(databaseName, userName, tablename);
    }

    @GetMapping("/getFields/{user}/{databasename}/{tablename}")
    public List<FieldInfo> getFields(@PathVariable("user") String userName, @PathVariable("databasename") String databaseName, @PathVariable("tablename") String tablename) {
        return tableInfoRepository.getFields(databaseName, userName, tablename);
    }

    @PostMapping("/getAllFields")
    public List<List<FieldInfo>> getFields(@RequestBody TableInfoRequest request) {
        List<Object[]> results = fieldInfoRepository.findFieldInfoByColumnNameInAndTableName(request.getColumns(), request.getTable());

        Map<Long, List<FieldInfo>> fieldInfoMap = results.stream()
                .collect(Collectors.groupingBy(o -> (Long) o[0], Collectors.mapping(o -> (FieldInfo) o[1], Collectors.toList())));

        return (List<List<FieldInfo>>) new ArrayList<List<FieldInfo>>(fieldInfoMap.values());
    }


    @Setter
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TableInfoRequest {
        private String database;
        private String table;
        private List<String> columns;
    }

}
