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
        System.out.println(userPayload);
        if (userInfoRepository.findByUsername(userPayload.getUsername()) != null) {
            return "Username is already taken";
        }
        if (userInfoRepository.findByEmail(userPayload.getEmail()) != null) {
            return "Email is already in use";
        }
        try {
            UserInfo userInfo;
            boolean isAdmin = !userPayload.getHash().isEmpty();

            if (isAdmin) {
                if (!Arrays.asList(availableHashes).contains(userPayload.getHash())) {
                    System.out.println(userPayload.getHash());
                    System.out.println("BadHash");
                    return "Hash incorrect";
                }

                userInfo = new UserInfo(userPayload.getUsername(), userPayload.getEmail(), userPayload.getPassword_hash(), true, null);
            } else {
                UserInfo admin = userInfoRepository.findByUsername(userPayload.getAdminName());
                if (admin == null) {
                    System.out.println("Incorrect admin");
                    return "Incorrect admin";
                }
                userInfo = new UserInfo(userPayload.getUsername(), userPayload.getEmail(), userPayload.getPassword_hash(), false, admin);
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

    @GetMapping("/getID/{userName}")
    public Long getID(@PathVariable("userName") String userName) {
        return usersService.getIdByUsername(userName);
    }

    @GetMapping("/checkifadmin/{userName}")
    public boolean checkIfAdmin(@PathVariable("userName") String userName) {
        return userInfoRepository.findByUsernameAndIsAdmin(userName, true) != null;
    }


    @GetMapping("/getsubordinates/{userName}")
    public List<UserInfo> getSubordinates(@PathVariable("userName") String userName) {
        return userInfoRepository.findByUsername(userName).getSubordinates();
    }

    @GetMapping("/getByUsername")
    public boolean getByUsername(@RequestParam("userName") String userName, @RequestParam("password") String password) {
        System.out.println(userName);
        System.out.println(password);
        Optional<Long> userId = userInfoRepository.checkLoginData(userName, password);
        return userId.isPresent();
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
