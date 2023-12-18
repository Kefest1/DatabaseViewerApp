package project.BackEnd.User;

import java.util.List;


public interface UserInfoService {
    public UserInfo saveUsers(UserPayload userPayload);
    public List<UserInfo> getAllUsers();
    public UserInfo getUsersByUsername(String username);
    public boolean checkExistenceByUsername(String username);
    public Long getIdByUsername(String username);
}
