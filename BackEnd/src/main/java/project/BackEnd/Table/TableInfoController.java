package project.BackEnd.Table;

import lombok.*;
import org.hibernate.id.enhanced.DatabaseStructure;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.BackEnd.DatabaseInfo.DatabaseInfo;
import project.BackEnd.DatabaseInfo.DatabaseInfoRepository;
import project.BackEnd.FieldInfo.FieldInfo;
import project.BackEnd.FieldInfo.FieldInfoRepository;
import project.BackEnd.OwnershipDetails.OwnershipDetailsPayload;
import project.BackEnd.OwnershipDetails.OwnershipDetailsRepository;
import project.BackEnd.OwnershipDetails.OwnershipDetailsService;
import project.BackEnd.User.UserInfoRepository;

import java.util.*;
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
        System.out.println();
        return tableInfoService.getAllTableInfo();
    }

    @PostMapping("/add")
    public Long saveInfo(@RequestParam("tableInfo") String tableName, @RequestParam("databaseID") Long databaseID, @RequestParam("primaryKey") String primaryKey) {

        TableInfo tableInfo = new TableInfo();
        tableInfo.setDatabaseInfo(databaseInfoRepository.getReferenceById(databaseID));
        tableInfo.setTableName(tableName);
        tableInfo.setPrimary_key(primaryKey);
        TableInfo newTable = tableInfoService.saveTableInfo(tableInfo);
        return newTable.getId();
    }

    @PostMapping("/addenhanced")
    public ResponseEntity<String> saveInfoEnhanced(@RequestParam("tableName") String tableName,
                                   @RequestParam("databaseName") String databaseName,
                                   @RequestParam("primaryKey") String primaryKey,
                                   @RequestParam("username") String username

    ) {
        List<String> tables = tableInfoRepository.findTableInfoAndByUserName(username, databaseName);
        if (!tables.isEmpty()) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body("Table with that name already exists");
        }
        TableInfo tableInfo = new TableInfo();

        tableInfo.setDatabaseInfo(databaseInfoRepository.getDatabaseInfoByDatabaseName(databaseName));
        tableInfo.setTableName(tableName);
        tableInfo.setPrimary_key(primaryKey);

        Long tableID = tableInfoService.saveTableInfo(tableInfo).getId();
        Long userID = userInfoRepository.findByUsername(username).getId();

        OwnershipDetailsPayload ownershipDetailsPayload = new OwnershipDetailsPayload(userID, tableID);
        ownershipDetailsService.addOwnershipDetails(ownershipDetailsPayload);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Table created successfully");
    }

    @DeleteMapping("/deletetable")
    public ResponseEntity<String> deleteTable(@RequestBody Long id) {
        System.out.println(id);
        try {
            tableStructureRepository.deleteTableStructureByTableInfo(id);
            tableInfoRepository.deleteTableInfoById(id);
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Cannot delete table that is not empty");
        }

        return ResponseEntity.status(HttpStatus.OK)
                .body("Table deleted successfully");
    }

    @DeleteMapping("/deletetableindexes")
    public ResponseEntity<String> deleteTable(@RequestBody Long[] id) {
        System.out.println(Arrays.toString(id));
        try {
            tableInfoRepository.deleteTableInfoByIds(Arrays.asList(id));
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Cannot delete table that is not empty");
        }

        return ResponseEntity.status(HttpStatus.OK)
                .body("Table deleted successfully");
    }

    @PutMapping("/updateTable")
    public String updateTable(@RequestBody UpdateTableRequest tableRequest) {
        System.out.println(tableRequest);
        TableInfo tableInfo = tableInfoRepository.findTableInstanceByTableNameAndDatabaseName(tableRequest.getTableName(), tableRequest.getDatabaseName());
        tableInfo.setPrimary_key(tableRequest.getPrimaryKey());
        tableInfo.setTableName(tableRequest.getNewTableName());

        tableInfoRepository.save(tableInfo);

        return "OK";
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @ToString
    static class UpdateTableRequest {
        private String tableName;
        private String newTableName;
        private String databaseName;
        private String primaryKey;
        private String username;
    }


    @PostMapping("/addtable/{username}/{databasename}/{tableName}")
    public String addTable(@PathVariable("username") String username, @PathVariable("databasename") String databasename, @PathVariable("tableName") String tableName) {
        Long userID = userInfoRepository.findByUsername(username).getId();
        DatabaseInfo databaseInfo = databaseInfoRepository.getDatabaseInfoByDatabaseName(databasename);

        TableInfo tableInfo = new TableInfo(databaseInfo, tableName, "primaryKey");
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

    @GetMapping("/getTableStructure/{username}/{databasename}/{tableName}")
    public List<FieldInfoDTO> getAvailableDatabasesByUserName(
            @PathVariable("username") String userName,
            @PathVariable("databasename") String databasename,
            @PathVariable("tableName") String tableName) {

        List<TableStructure> tableStructures = tableInfoRepository.findTableInstanceByTableNameAndDatabaseName(tableName, databasename).getTableStructure();

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

            TableStructure ts = tableStructureRepository.findTableStructuresByColumnNameAndTableName(fieldInfo.columnName, tableName, userName);
            if (ts != null) {
                continue;
            }

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
                tableInfo.getTableStructure().add(tableStructure);

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

    @PostMapping("/addFieldInfo/{datatype}/{columnName}/{tableid}/{userName}")
    public String addFieldInformation(
            @PathVariable("datatype") String datatype,
            @PathVariable("columnName") String columnName,
            @PathVariable("userName") String userName,
            @PathVariable("tableid") Long tableid
    ) {
        TableStructure tableStructure = new TableStructure();
        tableStructure.setColumnName(columnName);
        tableStructure.setColumnType(datatype);

        TableInfo tableInfoInstance = tableInfoRepository.getTableInfoById(tableid);
        String tableName = tableInfoInstance.getTableName();

        TableStructure ts = tableStructureRepository.findTableStructuresByColumnNameAndTableName(columnName, tableName, userName);

        if (ts == null) {
            System.out.println("Table already exists");
            return "Table already exists";
        }

        if (tableInfoInstance.getTableStructure() == null) {
            tableInfoInstance.setTableStructure(new ArrayList<>());
        }
        tableInfoInstance.getTableStructure().add(tableStructure);

        tableStructureRepository.save(tableStructure);

        tableInfoRepository.save(tableInfoInstance);
        System.out.println("Field information received successfully");

        return "Field information received successfully";
    }

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class FieldInfoDTO {
        private Long id;
        private String columnName;
        private String columnType;
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

    @GetMapping("/getKey/{databasename}/{tableName}")
    public String getPrimaryKeyName(@PathVariable("tableName") String tableName, @PathVariable("databasename") String databaseName) {
        return tableInfoRepository.findKeyNameByTable(tableName, databaseName);
    }

    @GetMapping("/getColumns/{user}/{databasename}/{tableName}")
    public List<String> getTablesForUserAndDatabase(@PathVariable("user") String userName, @PathVariable("databasename") String databaseName, @PathVariable("tableName") String tableName) {
        List<TableStructure> tableStructures =  tableInfoRepository.findColumnNamesByUserAndDatabaseAndTablenameFromStructure(databaseName, userName, tableName);
        return tableStructures.stream()
                .map(TableStructure::getColumnName)
                .collect(Collectors.toList());
    }

    @GetMapping("/getColumnsWithTypes/{user}/{databaseName}/{tableName}")
    public List<TableStructure> getColumnsWithTypes(@PathVariable("user") String userName, @PathVariable("databaseName") String databaseName, @PathVariable("tableName") String tableName) {
        return tableInfoRepository.findColumnNamesByUserAndDatabaseAndTablenameFromStructure(databaseName, userName, tableName);
    }

    @GetMapping("/getFields/{user}/{databasename}/{tableName}")
    public List<FieldInfo> getFields(@PathVariable("user") String userName, @PathVariable("databasename") String databaseName, @PathVariable("tableName") String tableName) {
        return tableInfoRepository.getFields(databaseName, userName, tableName);
    }

    @GetMapping("/getStructure/{user}/{databasename}/{tableName}")
    public List<TableStructure> getTableStructure(
            @PathVariable("user") String userName,
            @PathVariable("databasename") String databaseName,
            @PathVariable("tableName") String tableName) {
        return tableInfoRepository.findTableInstanceByTableNameAndDatabaseName(tableName, databaseName).getTableStructure();
    }

    @GetMapping("/checkIfTaken/{user}/{databasename}/{tableName}")
    public Boolean checkIfTaken(
            @PathVariable("user") String userName,
            @PathVariable("databasename") String databaseName,
            @PathVariable("tableName") String tableName) {
        return tableInfoRepository.findWithUsersAndTables(userName, tableName, databaseName).isPresent();
    }

    @GetMapping("/getFields/{databasename}/{tableName}")
    public List<String> getTableInfo( @PathVariable("databasename") String databaseName, @PathVariable("tableName") String tableName) {
        return tableInfoRepository.getTableInformation(databaseName, tableName);
    }

    @GetMapping("/checkIfTableEmpty/{databaseName}/{tableName}")
    public ResponseEntity<Boolean> checkIfTableEmpty(@PathVariable("databaseName") String databaseName, @PathVariable("tableName") String tableName) {
        Long fieldCount = tableInfoRepository.getFieldCount(databaseName, tableName);
        System.out.println(fieldCount);
        boolean isEmpty = (fieldCount == null || fieldCount == 0);
        return ResponseEntity.ok(isEmpty);
    }

    @GetMapping("/getDatabaseStructure/{databaseName}")
    public List<TableStructureInformationDTO> getDatabaseStructure(@PathVariable("databaseName") String databaseName) {
        List<TableInfo> list = tableInfoRepository.getTableStructure(databaseName);

        return list.stream()
                .map(node -> new TableStructureInformationDTO(node.getTableStructure(), node.getTableName()))
                .collect(Collectors.toList());
    }

    @ToString
    @Getter
    public class TableStructureInformationDTO {
        String tableName;
        List<TableStructure> tableStructures;

        public TableStructureInformationDTO(List<TableStructure> tableStructures, String tableName) {
            this.tableStructures = tableStructures;
            this.tableName = tableName;
        }
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

    @DeleteMapping("/deleteArray")
    public String deleteFieldInfo(@RequestBody Long[] columnIds) {
        try {
            tableInfoRepository.deleteTableInfoByIds(Arrays.asList(columnIds));
            return "OK";
        } catch (Exception e) {
            return e.toString();
        }
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
