package project.BackEnd.User;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class UserInfoController {

    @Autowired
    UserInfoService usersService;

    @PostMapping("/add")
    public String add(@RequestBody UserInfo userInfo) {
        usersService.saveUsers(userInfo);
        return "New user is added";
    }

    @GetMapping("/getAll")
    public List<UserInfo> list() {
        return usersService.getAllUsers();
    }

    @GetMapping("/getByUsername")
    public UserInfo getByUsername(@RequestParam("userName") String userInfoName) {
        System.out.println(userInfoName);
        return usersService.getUsersByUsername(userInfoName);
    }

    @GetMapping("/checkExistenceByUsername/{userInfoName}")
    public boolean checkExistenceByUsername(@PathVariable("userInfoName") String userInfoName) {
        return usersService.checkExistenceByUsername(userInfoName);
    }

}
