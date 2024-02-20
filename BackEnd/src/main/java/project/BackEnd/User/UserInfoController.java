package project.BackEnd.User;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.dao.DataIntegrityViolationException;

@RestController
@RequestMapping("/api/userinfo")
@CrossOrigin
public class UserInfoController {

    @Autowired
    UserInfoService usersService;

    @PostMapping("/add")
    public String add(@RequestBody UserPayload userPayload) {
        try {
            usersService.saveUsers(userPayload);
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

}
