/**
 * This class creates a Rest API controller for users.
 *
 * @author Szymon Bigoszewski
 * @version 1.0
 */
package project.BackEnd.User;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<Object> add(@RequestBody UserPayload userPayload) {
        if (userInfoRepository.findByUsername(userPayload.getUsername()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username is already taken");
        }
        if (userInfoRepository.findByEmail(userPayload.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email is already in use");
        }
        try {
            UserInfo userInfo;
            boolean isAdmin = !userPayload.getHash().isEmpty();

            if (isAdmin) {
                if (!Arrays.asList(availableHashes).contains(userPayload.getHash())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Hash incorrect");
                }

                userInfo = new UserInfo(userPayload.getUsername(), userPayload.getEmail(), userPayload.getPassword_hash(), true, null);
            } else {
                UserInfo admin = userInfoRepository.findByUsername(userPayload.getAdminName());
                if (admin == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Incorrect admin");
                }
                userInfo = new UserInfo(userPayload.getUsername(), userPayload.getEmail(), userPayload.getPassword_hash(), false, admin);
            }
            usersService.saveUsers(userInfo);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Data integrity violation: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error has occurred: " + e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.CREATED).body("New user is added");
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
        System.out.println("\nCheckIfadmin");
        System.out.println(userName);
        System.out.println();
        System.out.println();
        return userInfoRepository.findByUsernameAndIsAdmin(userName, true) != null;
    }

    @GetMapping("/getAdmin/{userName}")
    public String getAdmin(@PathVariable("userName") String userName) {
        return userInfoRepository.findAdmin(userName);
    }

    @GetMapping("/getAdminMail/{userName}")
    public String findAdminEmail(@PathVariable("userName") String userName) {
        return userInfoRepository.findAdminEmail(userName);
    }

    @GetMapping("/getsubordinates/{userName}")
    public List<UserInfo> getSubordinates(@PathVariable("userName") String userName) {
        return userInfoRepository.findByUsername(userName).getSubordinates();
    }

    @GetMapping("/getByUsername/{userName}/{password}")
    public boolean getByUsername(@PathVariable("userName") String userName, @PathVariable("password") String password) {
        Optional<Long> userId = userInfoRepository.checkLoginData(userName, password);
        return userId.isPresent();
    }

    @GetMapping("/getIdByUsername/{username}")
    public Long getIDByUsername(@PathVariable("username") String userInfoName) {
        return usersService.getUsersByUsername(userInfoName).getId();
    }

    @GetMapping("/checkExistenceByUsername/{userInfoName}")
    public boolean checkExistenceByUsername(@PathVariable("userInfoName") String userInfoName) {
        return usersService.checkExistenceByUsername(userInfoName);
    }

    @GetMapping("/details/{userName}")
    public ResponseEntity<UserDetailsResponse> getUserDetails(@PathVariable("userName") String userName) {
        try {
            var userInfo = userInfoRepository.findByUsername(userName);
            if (userInfo != null) {
                UserDetailsResponse userDetails = new UserDetailsResponse(userInfo.getUsername(), userInfo.getEmail());
                return ResponseEntity.ok(userDetails);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @ToString
    public class UserDetailsResponse {
        private String username;
        private String email;
    }

    static String[] availableHashes = {"abc", "qwerty"};
}
