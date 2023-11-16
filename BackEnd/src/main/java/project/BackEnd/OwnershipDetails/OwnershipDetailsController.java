package project.BackEnd.OwnershipDetails;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import project.BackEnd.Table.TableInfo;
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

//    @GetMapping("/getallus")
//    public List<OwnershipDetails> getAllODT() {
//        return ownershipDetailsRepository.findWithUsers();
//    }
//
//    @GetMapping("/getallta")
//    public List<OwnershipDetails> getAllODU() {
//        return ownershipDetailsRepository.findWithTables();
//    }

    @GetMapping("/gettablenames/{user}")
    public Set<String> getAllODJoined(@PathVariable("user") String username) {
        Long id = userInfoService.getIdByUsername(username);
        List<OwnershipDetails> ownershipDetails = ownershipDetailsRepository.findWithUsersAndTables(id);
        HashSet<String> availableTables = new HashSet<>();
        return ownershipDetails
                .stream()
                .map(e -> e.getTableInfo().getTableName())
                .collect(Collectors.toSet());
    }

    @PostMapping("/add")
    public String addUser(@RequestBody OwnershipDetailsPayload ownershipDetailsPayload) {
        System.out.println("------------");
        System.out.println(ownershipDetailsPayload);
        System.out.println("------------");

        ownershipDetailsService.addOwnershipDetails(ownershipDetailsPayload);
        return "OK";
    }

    @GetMapping("/getallavailabletables/{username}")
    public List<String> getAllAvailableTables(@PathVariable("username") String username) {
        System.out.println(username);
//        return ownershipDetailsRepository.findAllUsersTable(username)
//                .stream()
//                .map(ownershipDetails -> ownershipDetails.getTableInfo().getTableName())
//                .distinct()
//                .toList();
        return new LinkedList<String>(Collections.singleton("TODO"));
    }
}
