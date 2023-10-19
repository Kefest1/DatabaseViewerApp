package project.BackEnd.Table;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TableInfoServiceImpl implements TableInfoService {

    @Autowired
    TableInfoRepository tableInfoRepository;

    @Override
    public List<TableInfo> getAllTableInfo() {
        return tableInfoRepository.findAll();
    }
}
