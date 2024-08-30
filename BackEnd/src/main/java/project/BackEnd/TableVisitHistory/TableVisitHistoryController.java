package project.BackEnd.TableVisitHistory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import project.BackEnd.TableConnections.TableConnectionRepository;

@RestController
@RequestMapping("/api/tablevisithistory")
@CrossOrigin(origins = "http://localhost:3000")
public class TableVisitHistoryController {
    @Autowired
    TableVisitHistoryRepository tableVisitHistoryRepository;
}
