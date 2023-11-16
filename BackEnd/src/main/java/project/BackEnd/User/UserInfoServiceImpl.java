package project.BackEnd.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserInfoServiceImpl implements UserInfoService {

    @Autowired
    private UserInfoRepository userInfoRepository;

    @Override
    public UserInfo saveUsers(UserPayload userPayload) {
        var x = new UserInfo(userPayload.getMasterID(), userPayload.getUsername(), userPayload.getEmail(), userPayload.getPassword_hash());
        return userInfoRepository.save(x);
    }

    @Override
    public List<UserInfo> getAllUsers() {
        return userInfoRepository.findAll();
    }

    @Override
    public UserInfo getUsersByUsername(String username) {
        return userInfoRepository.findByUsername(username);
    }

    @Override
    public boolean checkExistenceByUsername(String username) {
        return userInfoRepository.findByUsername(username) != null;
    }

    @Override
    public UserInfo findByMasterID(Long masterID) {
        return userInfoRepository.findByMasterID(masterID);
    }

    @Override
    public Long getIdByUsername(String username) {
        return userInfoRepository.findByUsername(username).getId();
    }
}
