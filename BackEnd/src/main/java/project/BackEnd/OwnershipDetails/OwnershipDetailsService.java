package project.BackEnd.OwnershipDetails;

import project.BackEnd.User.UserInfo;

import java.util.List;

public interface OwnershipDetailsService {
    void addOwnershipDetails(OwnershipDetailsPayload ownershipDetailsPayload);

    List<OwnershipDetails> findAll();

    List<OwnershipDetails> findAllWithUserAndTableInfo();

//    List<UserInfo> findAllUsersTable(String name);
}
