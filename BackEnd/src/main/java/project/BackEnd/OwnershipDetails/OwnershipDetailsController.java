package project.BackEnd.OwnershipDetails;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import project.BackEnd.User.UserInfo;
import project.BackEnd.User.UserInfoRepository;

import java.util.LinkedList;
import java.util.List;
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

    @GetMapping("/getall")
    public List<OwnershipDetails> getAllOD() {
        return ownershipDetailsService.findAll();
    }

    @GetMapping("/getalljoined")
    public List<OwnershipDetails> getAllODJoined() {
        return ownershipDetailsService.findAllWithUserAndTableInfo();
    }

    @PostMapping("/add")
    public String addUser(@RequestBody OwnershipDetailsPayload ownershipDetailsPayload) {
        System.out.println(ownershipDetailsPayload);

        ownershipDetailsService.addOwnershipDetails(ownershipDetailsPayload);
        return "OK";
    }

    @GetMapping("/getallavailabletables/{username}")
    public List<String> getAllAvailableTables(@PathVariable("username") String username) {
        System.out.println(username);
        return ownershipDetailsRepository.findAllUsersTable(username)
                .stream()
                .map(ownershipDetails -> ownershipDetails.getTableInfo().getTableName())
                .distinct()
                .toList();
    }
}
