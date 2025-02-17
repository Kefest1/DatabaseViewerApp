/**
 * This class implements a service for table informations.
 *
 * @author Szymon Bigoszewski
 * @version 1.0
 */
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

    @Override
    public TableInfo saveTableInfo(TableInfo tableInfo) {
        return tableInfoRepository.save(tableInfo);
    }

    @Override
    public String getTableNameByID(Long ID) {
        return tableInfoRepository.getTableInfoById(ID).getTableName();
    }

    //    @Override
//    public List<String> getByUserName() {
//        return tableInfoRepository.getByUser();
//    }
}
