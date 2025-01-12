package project.BackEnd.TableVisitHistory;

import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import project.BackEnd.Table.TableInfo;
import project.BackEnd.Table.TableInfoRepository;
import project.BackEnd.TableConnections.TableConnection;
import project.BackEnd.TableConnections.TableConnectionRepository;
import project.BackEnd.User.UserInfo;
import project.BackEnd.User.UserInfoRepository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Date;

@RestController
@RequestMapping("/api/tablevisithistory")
@CrossOrigin(origins = "http://localhost:3000")
public class TableVisitHistoryController {

    @Autowired
    TableVisitHistoryRepository tableVisitHistoryRepository;

    @Autowired
    UserInfoRepository userInfoRepository;

    @Autowired
    TableInfoRepository tableInfoRepository;

    @GetMapping("/getall")
    public List<TableVisitHistory> getAll() {
        return tableVisitHistoryRepository.findAll();
    }

    @PostMapping("/addHistory")
    public String addConnection(@RequestBody AddPayload addPayload) {
        UserInfo userInfo = userInfoRepository.findByUsername(addPayload.userName);
        TableInfo tableInfo = tableInfoRepository.findTableInstanceByTableNameAndDatabaseName(addPayload.tableName, addPayload.databaseName);
        TableVisitHistory tableVisitHistory = new TableVisitHistory(tableInfo, userInfo, new Date());

        tableVisitHistoryRepository.save(tableVisitHistory);
        return "OK";
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @ToString
    static
    class AddPayload {
        String tableName;
        String userName;
        String databaseName;
    }
}
