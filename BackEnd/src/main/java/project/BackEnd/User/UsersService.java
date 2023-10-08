package project.BackEnd.User;

import java.util.List;


public interface UserInfoService {
    public UserInfo saveUserInfo(UserInfo userInfo);
    public List<UserInfo> getAllUserInfos();
}
