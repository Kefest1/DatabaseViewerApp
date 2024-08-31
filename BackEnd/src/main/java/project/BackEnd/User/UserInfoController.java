package project.BackEnd.User;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

import org.springframework.dao.DataIntegrityViolationException;

@RestController
@RequestMapping("/api/userinfo")
@CrossOrigin
public class UserInfoController {

    @Autowired
    UserInfoService usersService;

    @Autowired
    UserInfoRepository userInfoRepository;

    @PostMapping("/add")
    public String add(@RequestBody UserPayload userPayload) {
        try {
            UserInfo userInfo = null;
            boolean isAdmin = Arrays.stream(availableHashes).toList().contains(userPayload.getRegisterCode());

            if (isAdmin) {
                userInfo = new UserInfo(userPayload.getUsername(), userPayload.getEmail(), userPayload.getPassword_hash(), true);
            } else {
                UserInfo admin = userInfoRepository.findByUsername(userPayload.getAdminName());
                userInfo = new UserInfo(userPayload.getUsername(), userPayload.getEmail(), userPayload.getPassword_hash(), admin);
            }
            usersService.saveUsers(userInfo);
        } catch (DataIntegrityViolationException  e) {
            return e.getMessage();
        } catch (Exception e) {
            return "An error has occured";
        }
        return "New user is added";
    }

    @GetMapping("/getall")
    public List<UserInfo> list() {
        return usersService.getAllUsers();
    }

    @GetMapping("/getByUsername")
    public UserInfo getByUsername(@RequestParam("userName") String userInfoName) {
        System.out.println(userInfoName);
        return usersService.getUsersByUsername(userInfoName);
    }

    @GetMapping("/getIdByUsername/{username}")
    public Long getIDByUsername(@PathVariable("username") String userInfoName) {
        System.out.println(userInfoName);
        return usersService.getUsersByUsername(userInfoName).getId();
    }

    @GetMapping("/checkExistenceByUsername/{userInfoName}")
    public boolean checkExistenceByUsername(@PathVariable("userInfoName") String userInfoName) {
        return usersService.checkExistenceByUsername(userInfoName);
    }

    static String[] availableHashes = {"abc", "qwerty"};
}
