package project.BackEnd.FieldInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import project.BackEnd.Table.TableInfoRepository;

import java.util.List;

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

//    @GetMapping("/bycolumnnames")
//    public List<FieldInfo> getFieldInfosByColumnNames(@RequestParam Collection<String> columnNames, @RequestParam String tablename) {
//        return fieldInfoRepository.findFieldInfoByColumnNameInAndTableName(columnNames, tablename);
//    }

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
            System.out.println(updatePayload);
            Integer i = fieldInfoRepository.updateFieldInfoByColumnIdAndColumnName(updatePayload.newDataValue, updatePayload.rowIndex, updatePayload.columnName);
            return i.toString();
        } catch (Exception e) {
            System.out.println(e.getCause().toString());
            return "Error";
        }
    }

    @DeleteMapping("/delete")
    public String deleteFieldInfo(@RequestBody Integer columnID) {
        try {
            fieldInfoRepository.deleteByColumnId(columnID.longValue());
            return "OK";
        } catch (Exception e) {
            return e.toString();
        }
    }
}

