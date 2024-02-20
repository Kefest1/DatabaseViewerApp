package project.BackEnd.DatabaseInfo;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import project.BackEnd.OwnershipDetails.OwnershipDetails;
import project.BackEnd.User.UserInfo;

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

    @GetMapping("/getfoldermap/{username}")
    public List<String> getFolderMap(@PathVariable String username) {
        return databaseInfoRepository.findAllUsersTable(username);
    }
}
