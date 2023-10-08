package project.BackEnd.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserInfoServiceImpl implements UserInfoService {

    @Autowired
    private UserInfoRepository userInfoRepository;

    @Override
    public UserInfo saveUserInfo(UserInfo userInfo) {
        return userInfoRepository.save(userInfo);
    }

    @Override
    public List<UserInfo> getAllUserInfos() {
        return userInfoRepository.findAll();
    }
}
