package project.BackEnd.DatabaseInfo;

import org.springframework.stereotype.Service;

import java.util.List;


public interface DatabaseInfoService {
    List<DatabaseInfo> findAll();
}
