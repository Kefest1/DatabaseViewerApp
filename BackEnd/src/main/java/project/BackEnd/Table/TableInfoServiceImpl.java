package project.BackEnd.Table;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.BackEnd.OwnershipDetails.OwnershipDetails;
import project.BackEnd.User.UserInfo;

import java.util.List;

@Service
public class TableInfoServiceImpl implements TableInfoService {

    @Autowired
    TableInfoRepository tableInfoRepository;

    @Override
    public List<TableInfo> getAllTableInfo() {
        return tableInfoRepository.findAll();
    }

    @Override
    public void saveTableInfo(TableInfo tableInfo) {
        tableInfoRepository.save(tableInfo);
    }

//    @Override
//    public List<String> getByUserName() {
//        return tableInfoRepository.getByUser();
//    }
}
