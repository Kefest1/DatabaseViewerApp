package project.BackEnd.FieldInfo;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface FieldInfoService {

    List<FieldInfo> getAllFieldInfos();
    List<FieldInfo> getAllFieldInfosByColumnName(String columnName);
    List<String> getDataTypes();

}
