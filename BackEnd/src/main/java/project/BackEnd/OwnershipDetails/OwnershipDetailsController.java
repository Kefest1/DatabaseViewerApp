package project.BackEnd.OwnershipDetails;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ownershipdetails")
@CrossOrigin
public class OwnershipDetailsController {

    @Autowired
    OwnershipDetailsRepository ownershipDetailsService;

    @GetMapping("/getall")
    public List<OwnershipDetails> getAllOD() {
        return ownershipDetailsService.findAll();
    }

    @GetMapping("/getalljoined")
    public List<OwnershipDetails> getAllODJoined() {
        return ownershipDetailsService.findAllWithUserAndTableInfo();
    }

}
