package project.BackEnd.User;

import java.util.List;


public interface UserInfoService {
    public UserInfo saveUsers(UserInfo userInfo);
    public List<UserInfo> getAllUsers();
    public UserInfo getUsersByUsername(String username);
}
