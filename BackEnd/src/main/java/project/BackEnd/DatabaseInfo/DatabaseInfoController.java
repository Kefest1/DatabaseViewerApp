package project.BackEnd.DatabaseInfo;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import project.BackEnd.OwnershipDetails.OwnershipDetails;

import java.util.List;

@RestController
@RequestMapping("api/databaseinfo")
@CrossOrigin
public class DatabaseInfoController {

    @Autowired
    DatabaseInfoService databaseInfoService;

    @Autowired
    DatabaseInfoRepository databaseInfoRepository;

    @GetMapping("/getall")
    public List<DatabaseInfo> getDatabase() {
        return databaseInfoService.findAll();
    }

    @GetMapping("/getdatabasesbyuser/{username}")
    public List<String> getDatabasesByUser(@PathVariable("username") String username) {
        System.out.println(username);
//        return databaseInfoRepository.test(username);
        return null;
    }

}
