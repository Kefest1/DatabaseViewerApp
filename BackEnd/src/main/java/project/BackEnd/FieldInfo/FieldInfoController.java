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

    @GetMapping
    public List<FieldInfo> getAll() {
        return fieldInfoService.getAllFieldInfos();
    }


    @GetMapping("/{fieldName}")
    public List<FieldInfo> getAllByFieldName(@PathVariable String fieldName) {
        return fieldInfoService.getAllFieldInfosByColumnName(fieldName);
    }

}

