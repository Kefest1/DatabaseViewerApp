package project.BackEnd.OwnershipDetails;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.BackEnd.Table.TableInfo;
import project.BackEnd.Table.TableInfoRepository;
import project.BackEnd.User.UserInfo;
import project.BackEnd.User.UserInfoRepository;

import java.util.LinkedList;
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

        UserInfo userInfo = userInfoRepository.getReferenceById(ownershipDetailsPayload.userID);
        TableInfo tableInfo = tableInfoRepository.getReferenceById(ownershipDetailsPayload.tableID);
        System.out.println("----" + tableInfo + "----");
        ownershipDetails.getUsers().add(userInfo);
        ownershipDetails.getTables().add(tableInfo);

        ownershipDetailsRepository.save(ownershipDetails);
    }

    @Override
    public List<OwnershipDetails> findAll() {
        return ownershipDetailsRepository.findAll();
    }

    @Override
    public List<OwnershipDetails> findAllWithUserAndTableInfo() {
        return null;
    }

//    @Override
//    public List<OwnershipDetails> findAllWithUserAndTableInfo() {
//        return ownershipDetailsRepository.findAllWithUserAndTableInfo();
//    }

}
