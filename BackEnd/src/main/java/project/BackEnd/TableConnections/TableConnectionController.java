package project.BackEnd.TableConnections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tableconnection")
@CrossOrigin(origins = "http://localhost:3000")
public class TableConnectionController {

    @Autowired
    TableConnectionRepository tableConnectionRepository;

    @GetMapping("/getall")
    public List<TableConnection> getAll() {
        return tableConnectionRepository.findAll();
    }

    @PostMapping("/addconnection")
    public String addConnection(@RequestBody TableConnection tableConnection) {
        System.out.println("HERE: ");
        tableConnectionRepository.save(tableConnection);
        return "OK";
    }

}
