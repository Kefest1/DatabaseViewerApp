package project.BackEnd.TableConnections;

import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import project.BackEnd.Table.TableInfoRepository;
import project.BackEnd.Table.TableInfo;
import project.BackEnd.User.UserInfoRepository;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/tableconnection")
@CrossOrigin(origins = "http://localhost:3000")
public class TableConnectionController {

    @Autowired
    TableConnectionRepository tableConnectionRepository;

    @Autowired
    TableInfoRepository tableInfoRepository;


    @GetMapping("/getall")
    public List<TableConnection> getAll() {
        return tableConnectionRepository.findAll();
    }

    @PostMapping("/addconnection")
    public String addConnection(@RequestBody TableInfoPayload tableInfoPayload) {
        TableInfo tableInfoOne = tableInfoRepository.getTableInfoByTableName(tableInfoPayload.oneTableName);
        TableInfo tableInfoMany = tableInfoRepository.getTableInfoByTableName(tableInfoPayload.manyTableName);
        System.out.println(tableInfoPayload);
        TableConnection tableConnection = new TableConnection(tableInfoOne, tableInfoMany, tableInfoPayload.oneColumnName, tableInfoPayload.manyColumnName);
        tableConnectionRepository.save(tableConnection);
        return "OK";
    }

    @GetMapping("/getconnectedtables/{tablename}/{databasename}/{username}")
    public List<TableConnection> getConnectedTables(@PathVariable("tablename") String tablename, @PathVariable("username") String username, @PathVariable("databasename") String databasename) {
        Long id = tableInfoRepository.getTableIdByTableName(tablename);
        List<Long> availableTables = tableInfoRepository.findAvailableTables(databasename, username);

        List<TableConnection> listOne = tableConnectionRepository.getConnectedTablesOne(id);
        List<TableConnection> retlist = new LinkedList<>();

        for (Long availableId : availableTables) {
            for (TableConnection tableConnectionOne : listOne) {
                if (Objects.equals(tableConnectionOne.many.getId(), availableId)) {
                    retlist.add(tableConnectionOne);
                    break;
                }
            }
        }

        return retlist;
    }

    @ToString
    @NoArgsConstructor
    @AllArgsConstructor
    @Getter
    @Setter
    static class TableInfoPayload {
        String oneColumnName;
        String manyColumnName;

        String oneTableName;
        String manyTableName;
    }
}
