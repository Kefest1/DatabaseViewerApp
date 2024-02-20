package project.BackEnd.FieldInfo;

import org.hibernate.sql.Insert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.BackEnd.Table.TableInfo;
import project.BackEnd.Table.TableInfoRepository;

import java.util.Collection;
import java.util.List;

@RestController
@RequestMapping("api/fieldinfo")
@CrossOrigin
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

    @GetMapping("/bycolumnnames")
    public List<FieldInfo> getFieldInfosByColumnNames(@RequestParam Collection<String> columnNames, @RequestParam String tablename) {
        return fieldInfoRepository.findFieldInfoByColumnNameInAndTableName(columnNames, tablename);
    }

//    @GetMapping("/getcolumns/{username}")
//    public List<String> getAllByFieldName(@PathVariable String username) {
//        return fieldInfoRepository.findWithUsersAndTables(username);
//    }

    @PostMapping("/insertvalue")
    public String insertValue(@RequestBody InsertPayload fieldInfo) {
        String datatype = fieldInfoRepository.findTopDataTypeByColumnNameOrdered(fieldInfo.columnName, fieldInfo.tableName);
        FieldInfo fieldInfoToSave = new FieldInfo();
        fieldInfoToSave.setDataType(datatype);
        fieldInfoToSave.setColumnName(fieldInfo.columnName);
        fieldInfoToSave.setDataValue(fieldInfo.dataValue);
        fieldInfoToSave.setTableInfo(tableInfoRepository.findByTableName(fieldInfo.tableName));
        System.out.println(fieldInfoToSave);
        fieldInfoRepository.save(fieldInfoToSave);
        return "OK";
    }

    @PutMapping("/update")
    public String updateFieldInfo(@RequestBody UpdatePayload updatePayload) {
        try {
            fieldInfoRepository.updateFieldInfo(updatePayload.columnName, updatePayload.tableName, updatePayload.oldDataValue, updatePayload.newDataValue);
            return "OK";
        } catch (Exception e) {
            // Handle any exceptions that might occur during the update process
            return "Error";
        }
    }

    @DeleteMapping("/delete")
    public String deleteFieldInfo(@RequestBody InsertPayload insertPayload) {
        try {
            fieldInfoRepository.deleteFieldInfo(insertPayload.dataValue, insertPayload.columnName, insertPayload.tableName);
            return "OK";
        } catch (Exception e) {
            // Handle any exceptions that might occur during the update process
            return "Error";
        }
    }
}

