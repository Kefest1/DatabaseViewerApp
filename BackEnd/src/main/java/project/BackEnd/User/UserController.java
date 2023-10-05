package project.BackEnd.User;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class UserController {

    @Autowired
    private UserInfoService userInfoService;

    @PostMapping("/add")
    public String add(@RequestBody UserInfo userInfo) {
        userInfoService.saveUserInfo(userInfo);
        return "New user is added";
    }

    @GetMapping("/getAll")
    public List<UserInfo> list() {
        return userInfoService.getAllUserInfos();
    }

}