package project.BackEnd.FieldInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/fieldinfo")
@CrossOrigin
public class FieldInfoController {

    @Autowired
    FieldInfoService fieldInfoService;

    @GetMapping
    public List<FieldInfo> getAll() {
        return fieldInfoService.getAllFieldInfos();
    }

}

