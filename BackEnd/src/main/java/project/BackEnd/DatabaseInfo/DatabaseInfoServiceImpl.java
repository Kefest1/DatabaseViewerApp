package project.BackEnd.DatabaseInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DatabaseInfoServiceImpl implements DatabaseInfoService {

    @Autowired
    DatabaseInfoRepository databaseInfoRepository;

    @Override
    public List<DatabaseInfo> findAll() {
        return databaseInfoRepository.findAll();
    }
}
