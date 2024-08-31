package project.BackEnd.User;

import org.apache.catalina.User;

import java.util.List;


public interface UserInfoService {
    public UserInfo saveUsers(UserInfo userInfo);
    public List<UserInfo> getAllUsers();
    public UserInfo getUsersByUsername(String username);
    public boolean checkExistenceByUsername(String username);
    public Long getIdByUsername(String username);
}
