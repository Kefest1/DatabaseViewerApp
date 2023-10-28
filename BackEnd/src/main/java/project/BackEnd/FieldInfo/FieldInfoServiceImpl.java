package project.BackEnd.FieldInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FieldInfoServiceImpl implements FieldInfoService {

    @Autowired
    FieldInfoRepository fieldInfoRepository;

    @Override
    public List<FieldInfo> getAllFieldInfos() {
        return fieldInfoRepository.findAll();
    }

    @Override
    public List<FieldInfo> getAllFieldInfosByColumnName(String columnName) {
        return fieldInfoRepository.getFieldInfosByColumnName(columnName);
    }

    @Override
    public List<String> getDataTypes() {
        return null;
    }
}
