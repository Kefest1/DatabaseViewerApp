package project.BackEnd.TableConnections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import project.BackEnd.Table.TableInfoRepository;
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
    public String addConnection(@RequestBody TableConnection tableConnection) {
        System.out.println("HERE: ");
        tableConnectionRepository.save(tableConnection);
        return "OK";
    }

    @GetMapping("/getconnectedtables/{tablename}/{databasename}/{username}")
    public List<TableConnection> getConnectedTables(@PathVariable("tablename") String tablename, @PathVariable("username") String username, @PathVariable("databasename") String databasename) {
        Long id = tableInfoRepository.getTableIdByTableName(tablename);
        List<Long> availableTables = tableInfoRepository.findAvailableTables(databasename, username);

        List<TableConnection> listOne = tableConnectionRepository.getConnectedTablesOne(id);
        List<TableConnection> listMany = tableConnectionRepository.getConnectedTablesMany(id);
        List<TableConnection> retlist = new LinkedList<>();

        for (Long availableId : availableTables) {
            for (TableConnection tableConnectionOne : listOne) {
                if (Objects.equals(tableConnectionOne.many.getId(), availableId)) {
                    retlist.add(tableConnectionOne);
                    break;
                }
            }
            for (TableConnection tableConnectionMany : listMany) {
                if (Objects.equals(tableConnectionMany.one.getId(), availableId)) {
                    retlist.add(tableConnectionMany);
                    break;
                }
            }
        }


        return retlist;
    }
}
