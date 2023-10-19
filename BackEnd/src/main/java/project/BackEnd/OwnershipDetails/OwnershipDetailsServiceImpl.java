package project.BackEnd.OwnershipDetails;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OwnershipDetailsServiceImpl implements OwnershipDetailsService {

    @Autowired
    OwnershipDetailsRepository ownershipDetailsRepository;



}
