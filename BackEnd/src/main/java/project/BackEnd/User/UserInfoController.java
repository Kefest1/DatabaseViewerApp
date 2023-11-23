package project.BackEnd.User;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.BackEnd.auth.AuthenticationRequest;
import project.BackEnd.auth.AuthenticationResponse;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class UserInfoController {

    @Autowired
    UserInfoService usersService;

//    @PostMapping("/register")
//    public ResponseEntity<AuthenticationResponse> register(
//            @RequestBody RegisterRequest request
//    ) {
//        usersService.saveUsers(userPayload);
//        return "New user is added";
//    }
//
//    @PostMapping("/authenticate")
//    public ResponseEntity<AuthenticationResponse> authenticate(
//            @RequestBody AuthenticationRequest request
//    ) {
//
//    }

    @GetMapping("/getAll")
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

}
