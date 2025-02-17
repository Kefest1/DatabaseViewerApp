/**
 * This class defines a ownership details Rest API controller.
 *
 * @author Szymon Bigoszewski
 * @version 1.0
 */
package project.BackEnd.OwnershipDetails;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import project.BackEnd.DatabaseInfo.DatabaseInfoRepository;
import project.BackEnd.Table.TableInfo;
import project.BackEnd.Table.TableInfoRepository;
import project.BackEnd.User.UserInfo;
import project.BackEnd.User.UserInfoRepository;
import project.BackEnd.User.UserInfoService;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ownershipdetails")
@CrossOrigin
public class OwnershipDetailsController {

    @Autowired
    OwnershipDetailsService ownershipDetailsService;

    @Autowired
    OwnershipDetailsRepository ownershipDetailsRepository;

    @Autowired
    UserInfoRepository userInfoRepository;

    @Autowired
    UserInfoService userInfoService;

    @Autowired
    DatabaseInfoRepository databaseInfoRepository;

    @Autowired
    TableInfoRepository tableInfoRepository;

    @PostMapping("/add")
    public String addUser(@RequestBody OwnershipDetailsPayload ownershipDetailsPayload) {
        ownershipDetailsService.addOwnershipDetails(ownershipDetailsPayload);
        return "OK";
    }

    @PostMapping("/addbyusername/{tableid}/{username}")
    public String addUserByName(@PathVariable("tableid") Long tableid, @PathVariable("username") String username) {
        Long userID = userInfoRepository.findUserIDByUsername(username);

        ownershipDetailsService.addOwnershipDetails(new OwnershipDetailsPayload(userID, tableid));

        return "OK";
    }


    @PostMapping("/add/{userName}/{adminName}/{databaseName}")
    public String addUserByAdmin(@PathVariable("userName") String userName,
                                 @PathVariable("adminName") String adminName,
                                 @PathVariable("databaseName") String databaseName,
                                 @RequestParam("tableNames") String[] tableNames) {

        UserInfo userInfo = userInfoRepository.findByUsername(userName);
        Long userID = userInfo.getId();
        for (String tableName : tableNames) {
            Long tableID = tableInfoRepository.getTableInfoID(databaseName, adminName, tableName);
            OwnershipDetailsPayload ownershipDetailsPayload = new OwnershipDetailsPayload(userID, tableID);
            ownershipDetailsService.addOwnershipDetails(ownershipDetailsPayload);
        }
        return "OK";
    }

    @DeleteMapping("/delete/{userName}/{adminName}/{databaseName}")
    public String deleteUserByAdmin(@PathVariable("userName") String userName,
                                    @PathVariable("adminName") String adminName,
                                    @PathVariable("databaseName") String databaseName,
                                    @RequestParam("tableNames") String[] tableNames) {

        UserInfo userInfo = userInfoRepository.findByUsername(userName);
        Long userID = userInfo.getId();
        for (String tableName : tableNames) {
            Long tableID = tableInfoRepository.getTableInfoID(databaseName, adminName, tableName);
            // TODO Debug
            ownershipDetailsRepository.deleteOwnershipDetailsByUserInfoIdAndTableInfoId(userID, tableID);
        }
        return "OK";
    }


    @GetMapping("/getall")
    public List<OwnershipDetails> getall() {
        return ownershipDetailsService.findAll();
    }

}
