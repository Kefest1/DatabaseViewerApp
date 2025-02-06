package project.BackEnd.TableAccessQueue;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import project.BackEnd.Table.TableInfoRepository;

@RestController
@RequestMapping("/api/accesscontroller")
@CrossOrigin(origins = "http://localhost:3000")
public class TableAccessController {

    @Autowired
    TableInfoRepository tableInfoRepository;

    TableAccessQueue tableAccessQueue;

    public TableAccessController() {
        tableAccessQueue = new TableAccessQueue();
    }

    @GetMapping("/addAndCheck/{databaseName}/{tableName}/{username}")
    public boolean addAndCheck(@PathVariable String databaseName, @PathVariable String tableName, @PathVariable String username) {
        Long tableID = tableInfoRepository.getTableInfoID(databaseName, "user1", tableName);
        return tableAccessQueue.addAndCheckIfCanBeAccessed(new TableAccessData(tableID, username, -1));
    }

    @GetMapping("/checkPosition/{databaseName}/{tableName}/{username}")
    public int checkPosition(@PathVariable String databaseName, @PathVariable String tableName, @PathVariable String username) {
        Long tableID = tableInfoRepository.getTableInfoID(databaseName, "user1", tableName);

        return tableAccessQueue.getPosition(new TableAccessData(tableID, username, -1));
    }

    @GetMapping("/popPosition/{databaseName}/{tableName}/{username}")
    public boolean popPosition(@PathVariable String databaseName, @PathVariable String tableName, @PathVariable String username) {
        Long tableID = tableInfoRepository.getTableInfoID(databaseName, "user1", tableName);
        return tableAccessQueue.popPosition(new TableAccessData(tableID, username, -1));
    }

    @GetMapping("/debug")
    public boolean debug() {
        tableAccessQueue.log();
        return true;
    }

    @GetMapping("/clear")
    public boolean clear() {
        tableAccessQueue.clear();
        return true;
    }

}
