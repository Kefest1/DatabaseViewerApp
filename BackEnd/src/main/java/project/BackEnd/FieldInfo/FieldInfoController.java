package project.BackEnd.FieldInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import project.BackEnd.Table.TableInfoRepository;

import java.util.*;

@RestController
@RequestMapping("api/fieldinfo")
@CrossOrigin(origins = "http://localhost:3000")
public class FieldInfoController {

    @Autowired
    FieldInfoService fieldInfoService;

    @Autowired
    FieldInfoRepository fieldInfoRepository;

    @Autowired
    TableInfoRepository tableInfoRepository;

    @GetMapping
    public List<FieldInfo> getAll() {
        return fieldInfoService.getAllFieldInfos();
    }

    @GetMapping("/getColumns/{databasename}/{tablename}/{columnname}")
    public List<String> getSingleColumnData(@PathVariable("databasename") String databasename, @PathVariable("tablename") String tablename, @PathVariable("columnname") String columnname) {

        List<String> rows = fieldInfoRepository.getSingleRow(tablename, columnname, databasename);
        return rows;
    }

    @GetMapping("/getsmallestfreekey/{databasename}/{tablename}")
    public Integer getSmallestFreeKey(@PathVariable("databasename") String databasename, @PathVariable("tablename") String tablename) {

        String primaryKeyName = tableInfoRepository.findKeyNameByTable(tablename, databasename);
        List<Integer> numbers = new ArrayList<>();

        List<String> keys = fieldInfoRepository.findFirstFreeKeyFieldWithUsersAndTables(tablename, primaryKeyName);

        for (String key : keys) {
            try {
                int num = Integer.parseInt(key);
                if (num > 0) {
                    numbers.add(num);
                }
            } catch (NumberFormatException e) {
                System.out.println("Invalid number format: " + key);
            }
        }
        Collections.sort(numbers);

        int smallestMissing = 1;
        for (int num : numbers) {
            if (num == smallestMissing)
                smallestMissing++;
            else if (num > smallestMissing)
                break;

        }

        return smallestMissing;
    }

//    @GetMapping("/bycolumnnames")
//    public List<FieldInfo> getFieldInfosByColumnNames(@RequestParam Collection<String> columnNames, @RequestParam String tablename) {
//        return fieldInfoRepository.findFieldInfoByColumnNameInAndTableName(columnNames, tablename);
//    }

//    @GetMapping("/getcolumns/{username}")
//    public List<String> getAllByFieldName(@PathVariable String username) {
//        return fieldInfoRepository.findWithUsersAndTables(username);
//    }


    @PostMapping("/insertvalues/{databasename}")
    public String insertValues(@PathVariable("databasename") String databasename, @RequestBody List<InsertPayload> fieldInfos) {
        Long newID = getFreeColumnID();

        Integer smallestKey = getSmallestFreeKey(databasename, fieldInfos.get(0).getTableName());
        System.out.println(smallestKey);
        String primaryKey = tableInfoRepository.findKeyNameByTable(fieldInfos.get(0).tableName, databasename);

        FieldInfo insertPayloadPrimaryKey = new FieldInfo();
        String datatype = fieldInfoRepository.findTopDataTypeByColumnNameOrdered(fieldInfos.get(0).columnName, fieldInfos.get(0).tableName).get(0);
        insertPayloadPrimaryKey.setDataType(datatype);
        insertPayloadPrimaryKey.setColumnName(fieldInfos.get(0).columnName);
        insertPayloadPrimaryKey.setDataValue(String.valueOf(smallestKey));
        insertPayloadPrimaryKey.setTableInfo(tableInfoRepository.findByTableName(fieldInfos.get(0).tableName));
        insertPayloadPrimaryKey.setColumnId(newID);
        fieldInfoRepository.save(insertPayloadPrimaryKey);

        for (InsertPayload fieldInfo : fieldInfos) {
            if (!Objects.equals(fieldInfo.columnName, primaryKey))
                insertValueHelper(fieldInfo, newID);
        }
        return "OK";
    }

    private void insertValueHelper(InsertPayload fieldInfo, Long newID) {
        String datatype = fieldInfoRepository.findTopDataTypeByColumnNameOrdered(fieldInfo.columnName, fieldInfo.tableName).get(0);
        FieldInfo fieldInfoToSave = new FieldInfo();
        fieldInfoToSave.setDataType(datatype);
        fieldInfoToSave.setColumnName(fieldInfo.columnName);
        fieldInfoToSave.setDataValue(fieldInfo.dataValue);
        fieldInfoToSave.setColumnId(newID);
        fieldInfoToSave.setTableInfo(tableInfoRepository.findByTableName(fieldInfo.tableName));
        System.out.println(fieldInfoToSave);
        fieldInfoRepository.save(fieldInfoToSave);
    }

    private Long getFreeColumnID() {
        return fieldInfoRepository.findMaxColumnID();
    }

    @PostMapping("/update")
    public String updateFieldInfo(@RequestBody List<UpdatePayload> updatePayloads) {
        try {
            for (UpdatePayload updatePayload : updatePayloads) {
                System.out.println(updatePayload);
                Integer i = fieldInfoRepository.updateFieldInfoByColumnIdAndColumnName(updatePayload.newDataValue, updatePayload.rowIndex, updatePayload.columnName);
            }
            return "Success";
        } catch (Exception e) {
            System.out.println(e.getCause().toString());
            return "Error";
        }
    }

    @DeleteMapping("/delete")
    public String deleteFieldInfo(@RequestBody Long columnID) {
        try {
            System.out.println(columnID);
            fieldInfoRepository.deleteByColumnId(columnID);
            return "OK";
        } catch (Exception e) {
            return e.toString();
        }
    }

    @DeleteMapping("/deleteArray")
    public String deleteFieldInfo(@RequestBody Long[] columnIds) {
        try {
             fieldInfoRepository.deleteByColumnIds(Arrays.asList(columnIds));
            return "OK";
        } catch (Exception e) {
            return e.toString();
        }
    }
}

