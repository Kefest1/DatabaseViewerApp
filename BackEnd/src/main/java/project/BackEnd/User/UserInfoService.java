package project.BackEnd.User;

import org.apache.catalina.User;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;


public interface UserInfoService extends UserDetailsService {
    public UserInfo saveUsers(UserInfo userInfo);
    public List<UserInfo> getAllUsers();
    public UserInfo getUsersByUsername(String username);
    public boolean checkExistenceByUsername(String username);
    public Long getIdByUsername(String username);
}
