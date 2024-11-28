package project.BackEnd.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import project.BackEnd.DatabaseInfo.DatabaseInfo;
import project.BackEnd.DatabaseInfo.DatabaseInfoRepository;
import project.BackEnd.FieldInfo.FieldInfo;
import project.BackEnd.FieldInfo.FieldInfoRepository;
import project.BackEnd.OwnershipDetails.OwnershipDetailsPayload;
import project.BackEnd.OwnershipDetails.OwnershipDetailsRepository;
import project.BackEnd.OwnershipDetails.OwnershipDetailsService;
import project.BackEnd.User.UserInfoRepository;
import project.BackEnd.Table.TableStructureRepository;

import java.util.ArrayList;
import java.util.LinkedList;
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

    @Autowired
    TableStructureRepository tableStructureRepository;

    @Autowired
    UserInfoRepository userInfoRepository;

    @Autowired
    private DatabaseInfoRepository databaseInfoRepository;

    @Autowired
    private OwnershipDetailsRepository ownershipDetailsRepository;

    @Autowired
    private OwnershipDetailsService ownershipDetailsService;

    @GetMapping("/getall")
    public List<TableInfo> getAllTableInfos() {
        return tableInfoService.getAllTableInfo();
    }

    @PostMapping("/add")
    public Long saveInfo(@RequestParam("tableInfo") String tableName, @RequestParam("databaseID") Long databaseID, @RequestParam("primaryKey") String primaryKey) {
        System.out.println(tableName);
        System.out.println(databaseID);
        System.out.println(primaryKey);
        TableInfo tableInfo = new TableInfo();
        tableInfo.setDatabaseInfo(databaseInfoRepository.getReferenceById(databaseID));
        tableInfo.setTableName(tableName);
        tableInfo.setPrimary_key(primaryKey);
        TableInfo newTable = tableInfoService.saveTableInfo(tableInfo);
        return newTable.getId();
    }

    @PostMapping("/addenhanced")
    public String saveInfoEnhanced(@RequestParam("tableInfo") String tableName,
                                 @RequestParam("databaseName") String databaseName,
                                 @RequestParam("primaryKey") String primaryKey,
                                 @RequestParam("username") String username

    ) {

        System.out.println(tableName);
        System.out.println(databaseName);
        System.out.println(primaryKey);

        TableInfo tableInfo = new TableInfo();
        tableInfo.setDatabaseInfo(databaseInfoRepository.getDatabaseInfoByDatabaseName(databaseName));
        tableInfo.setTableName(tableName);
        tableInfo.setPrimary_key(primaryKey);
        tableInfoService.saveTableInfo(tableInfo);
        return "Ok";
    }

    @PostMapping("/addtable/{username}/{databasename}/{tableName}")
    public String addTable(@PathVariable("username") String username, @PathVariable("databasename") String databasename, @PathVariable("tableName") String tableName) {
        Long userID = userInfoRepository.findByUsername(username).getId();
        DatabaseInfo databaseInfo = databaseInfoRepository.getDatabaseInfoByDatabaseName(databasename);

        TableInfo tableInfo = new TableInfo(databaseInfo, tableName);
        Long tableID = tableInfoService.saveTableInfo(tableInfo).getId();

        OwnershipDetailsPayload ownershipDetailsPayload = new OwnershipDetailsPayload(userID, tableID);
        ownershipDetailsService.addOwnershipDetails(ownershipDetailsPayload);
        return "OK";
    }

    @GetMapping("/getAvailableDatabases/{username}")
    public List<String> getAvailableTablesByUserName(@PathVariable("username") String userName) {
        return tableInfoRepository.findDatabasesByUserName(userName);
    }

    @GetMapping("/getAvailableTables/{username}/{database}")
    public List<String> getAvailableTables(@PathVariable("username") String userName, @PathVariable("database") String database) {
        return tableInfoRepository.findAvailableTableNames(database, userName);
    }

    @GetMapping("/getAvailableDatabasesObject/{username}")
    public List<DatabaseInfo> getAvailableDatabasesByUserName(@PathVariable("username") String userName) {
        return tableInfoRepository.findDatabasesObjectsByUserName(userName);
    }

    @GetMapping("/getTableStructure/{username}/{databasename}/{tablename}")
    public List<FieldInfoDTO> getAvailableDatabasesByUserName(
            @PathVariable("username") String userName,
            @PathVariable("databasename") String databasename,
            @PathVariable("tablename") String tablename) {

        List<TableStructure> tableStructures = tableInfoRepository.findTableInstanceByTableNameAndDatabaseName(tablename, databasename).getFieldInformation();

        // Map TableStructure to FieldInfoDTO, including the ID
        List<FieldInfoDTO> fieldInfoDTOs = tableStructures.stream()
                .map(ts -> new FieldInfoDTO(ts.getId(), ts.getColumnName(), ts.getColumnType()))
                .collect(Collectors.toList());

        return fieldInfoDTOs;
    }

    @PostMapping("/addFieldInformation/{databaseName}/{tableName}/{userName}")
    public String receiveFieldInfo(@RequestBody FieldInfoDTO[] fieldInfoArray,
                                   @PathVariable("databaseName") String databaseName,
                                   @PathVariable("tableName") String tableName,
                                   @PathVariable("userName") String userName
    ) {
        for (FieldInfoDTO fieldInfo : fieldInfoArray) {
            System.out.println("Column Name: " + fieldInfo.getColumnName() + ", Column Type: " + fieldInfo.getColumnType() + ", ID: " + fieldInfo.getId());

            if (fieldInfo.getId() > 0) {
                TableStructure tableStructure = tableStructureRepository.getReferenceById(fieldInfo.getId());
                tableStructure.setColumnName(fieldInfo.getColumnName());
                tableStructure.setColumnType(fieldInfo.getColumnType());

                tableStructureRepository.save(tableStructure);
            }
            else {
                TableStructure tableStructure = new TableStructure();
                tableStructure.setColumnName(fieldInfo.getColumnName());
                tableStructure.setColumnType(fieldInfo.getColumnType());
                tableStructureRepository.save(tableStructure);

                TableInfo tableInfo = tableInfoRepository.findTableInstanceByTableNameAndDatabaseName(tableName, databaseName);
                tableInfo.getFieldInformation().add(tableStructure);

                tableStructureRepository.save(tableStructure);
            }

        }

        return "Field information received successfully";
    }


    @DeleteMapping("/deleteFieldInfo")
    public String deleteFieldInfoByIds(@RequestBody List<Long> ids) {
        tableStructureRepository.deleteAllById(ids);
        return "OK";
    }

    @PostMapping("/addFieldInfo/{datatype}/{columnName}/{tableid}")
    public String addFieldInformation(
            @PathVariable("datatype") String datatype,
            @PathVariable("columnName") String columnName,
            @PathVariable("tableid") Long tableid
    ) {
        TableStructure tableStructure = new TableStructure();
        tableStructure.setColumnName(columnName);
        tableStructure.setColumnType(datatype);

        TableInfo tableInfoInstance = tableInfoRepository.getTableInfoById(tableid);

        if (tableInfoInstance.getFieldInformation() == null) {
            tableInfoInstance.setFieldInformation(new ArrayList<>());
        }
        tableInfoInstance.getFieldInformation().add(tableStructure);

        tableStructureRepository.save(tableStructure);

        tableInfoRepository.save(tableInfoInstance);

        return "Field information received successfully";
    }


    public static class FieldInfoDTO {
        private Long id;
        private String columnName;
        private String columnType;

        public FieldInfoDTO() {}

        public FieldInfoDTO(Long id, String columnName, String columnType) {
            this.id = id;
            this.columnName = columnName;
            this.columnType = columnType;
        }

        // Getters
        public Long getId() {
            return id;
        }

        public String getColumnName() {
            return columnName;
        }

        public String getColumnType() {
            return columnType;
        }
    }

    @GetMapping("/getAvailableTablesToAdd/{adminName}/{username}")
    public List<List<String>> getAvailableTablesByUserName(@PathVariable("username") String userName,
                                                   @PathVariable("adminName") String adminName) {

        List<String> adminTables = tableInfoRepository.findTableInfoAndDatabasesByUserName(adminName);
        List<String> userTables = tableInfoRepository.findTableInfoAndDatabasesByUserName(userName);


        List<String> availableTables = new ArrayList<>(adminTables);
        availableTables.removeAll(userTables);

        LinkedList<List<String>> retList = new LinkedList<>();
        retList.add(availableTables);
        retList.add(userTables);

        System.out.println(adminTables);
        System.out.println(userTables);
        System.out.println(availableTables);
        return retList;
    }


    @GetMapping("/getAvailableTablesAndDatabases/{adminName}/{username}/{databaseName}")
    public List<String> getAvailableTablesAndDatabasesByUserName(@PathVariable("username") String userName,
                                                                 @PathVariable("adminName") String adminName,
                                                                 @PathVariable("databaseName") String databaseName) {

        List<String> adminTables = tableInfoRepository.findTableInfoAndByUserName(adminName, databaseName);
        List<String> userTables = tableInfoRepository.findTableInfoAndByUserName(userName, databaseName);

        List<String> availableTables = new ArrayList<>(adminTables);
        availableTables.removeAll(userTables);

        return availableTables;
    }

    @GetMapping("/getAllowedTablesAndDatabases/{adminName}/{username}/{databaseName}")
    public List<String> getAllowedTablesAndDatabasesByAdminName(@PathVariable("username") String userName,
                                                                @PathVariable("adminName") String adminName,
                                                                @PathVariable("databaseName") String databaseName) {

        List<String> adminTables = tableInfoRepository.findTableInfoAndByUserName(adminName, databaseName);
        List<String> userTables = tableInfoRepository.findTableInfoAndByUserName(userName, databaseName);

        List<String> commonTables = new ArrayList<>(adminTables);
        commonTables.retainAll(userTables);

        return commonTables;
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

    @GetMapping("/getKey/{databasename}/{tablename}")
    public String getPrimaryKeyName(@PathVariable("tablename") String tableName, @PathVariable("databasename") String databaseName) {
        return tableInfoRepository.findKeyNameByTable(tableName, databaseName);
    }

    @GetMapping("/getColumns/{user}/{databasename}/{tablename}")
    public List<String> getTablesForUserAndDatabase(@PathVariable("user") String userName, @PathVariable("databasename") String databaseName, @PathVariable("tablename") String tablename) {
        return tableInfoRepository.findColumnNamesByUserAndDatabaseAndTablename(databaseName, userName, tablename);
    }

    @GetMapping("/getFields/{user}/{databasename}/{tablename}")
    public List<FieldInfo> getFields(@PathVariable("user") String userName, @PathVariable("databasename") String databaseName, @PathVariable("tablename") String tablename) {
        return tableInfoRepository.getFields(databaseName, userName, tablename);
    }

    @GetMapping("/getFields/{databasename}/{tablename}")
    public List<String> getTableInfo( @PathVariable("databasename") String databaseName, @PathVariable("tablename") String tablename) {
        return tableInfoRepository.getTableInformation(databaseName, tablename);
    }

    @PostMapping("/getAllFields")
    public List<List<FieldInfo>> getFields(@RequestBody TableInfoRequest request) {
        List<Object[]> results = fieldInfoRepository.findFieldInfoByColumnNameInAndTableName(request.getColumns(), request.getTable());

        Map<Long, List<FieldInfo>> fieldInfoMap = results.stream()
                .collect(Collectors.groupingBy(o -> (Long) o[0], Collectors.mapping(o -> (FieldInfo) o[1], Collectors.toList())));

        return (List<List<FieldInfo>>) new ArrayList<List<FieldInfo>>(fieldInfoMap.values());
    }

    @PostMapping("/getAllFieldsAllColumns")
    public List<List<FieldInfo>> getFields(@RequestBody TableInfoBasicRequest request) {
        List<Object[]> results = fieldInfoRepository.findFieldInfoTableName(request.getTable());

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


    @Setter
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TableInfoBasicRequest {
        private String database;
        private String table;
    }


    @Setter
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TableStructureDTO {
        private String columnName;
        private String table;
    }



}
