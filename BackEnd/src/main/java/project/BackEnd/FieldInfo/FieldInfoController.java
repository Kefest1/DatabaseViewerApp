package project.BackEnd.FieldInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/fieldinfo")
@CrossOrigin
public class FieldInfoController {

    @Autowired
    FieldInfoService fieldInfoService;

    @Autowired
    FieldInfoRepository fieldInfoRepository;

    @GetMapping
    public List<FieldInfo> getAll() {
        return fieldInfoService.getAllFieldInfos();
    }


    @GetMapping("/getcolumns/{username}")
    public List<String> getAllByFieldName(@PathVariable String username) {
        return fieldInfoRepository.findWithUsersAndTables(username);
    }

}

