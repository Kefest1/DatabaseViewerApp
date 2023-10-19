package project.BackEnd.DatabaseInfo;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/databaseinfo")
@CrossOrigin
public class DatabaseInfoController {

    @Autowired
    DatabaseInfoService databaseInfoService;

    @GetMapping("/getall")
    public List<DatabaseInfo> getDatabase() {
        return databaseInfoService.findAll();
    }

}
