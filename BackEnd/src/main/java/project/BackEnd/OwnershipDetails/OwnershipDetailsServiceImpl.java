package project.BackEnd.OwnershipDetails;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.BackEnd.Table.TableInfoRepository;
import project.BackEnd.User.UserInfo;
import project.BackEnd.User.UserInfoRepository;

import java.util.List;

@Service
public class OwnershipDetailsServiceImpl implements OwnershipDetailsService {

    @Autowired
    OwnershipDetailsRepository ownershipDetailsRepository;

    @Autowired
    TableInfoRepository tableInfoRepository;

    @Autowired
    UserInfoRepository userInfoRepository;

    @Override
    public void addOwnershipDetails(OwnershipDetailsPayload ownershipDetailsPayload) {
        OwnershipDetails ownershipDetails = new OwnershipDetails(ownershipDetailsPayload.ownershipDetails);
        ownershipDetails.setUser(userInfoRepository.getReferenceById(ownershipDetailsPayload.userID));
        ownershipDetails.setTableInfo(tableInfoRepository.getReferenceById(ownershipDetailsPayload.tableID));
        ownershipDetailsRepository.save(ownershipDetails);
    }

    @Override
    public List<OwnershipDetails> findAll() {
        return ownershipDetailsRepository.findAll();
    }

    @Override
    public List<OwnershipDetails> findAllWithUserAndTableInfo() {
        return ownershipDetailsRepository.findAllWithUserAndTableInfo();
    }

}
