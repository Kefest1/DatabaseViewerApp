package project.BackEnd.Table;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tableinfo")
@CrossOrigin
public class TableInfoController {

    @Autowired
    TableInfoService tableInfoService;

    @GetMapping("/getall")
    public List<TableInfo> getAllTableInfos() {
        return tableInfoService.getAllTableInfo();
    }

}
