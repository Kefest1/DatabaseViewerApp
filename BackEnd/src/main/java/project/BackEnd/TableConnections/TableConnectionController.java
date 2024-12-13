package project.BackEnd.TableConnections;

import jakarta.persistence.Column;
import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import project.BackEnd.Table.TableInfoRepository;
import project.BackEnd.Table.TableInfo;
import project.BackEnd.User.UserInfoRepository;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tableconnection")
@CrossOrigin(origins = "http://localhost:3000")
public class TableConnectionController {

    @Autowired
    TableConnectionRepository tableConnectionRepository;

    @Autowired
    TableInfoRepository tableInfoRepository;

    @GetMapping("/getAll")
    public List<TableInfo> getAllTableConnections() {
        return tableInfoRepository.findAll();
    }

    @PostMapping("/addconnection")
    public String addConnection(@RequestBody TableInfoPayload tableInfoPayload) {
        TableInfo tableInfoOne = tableInfoRepository.getTableInfoByTableName(tableInfoPayload.oneTableName);
        TableInfo tableInfoMany = tableInfoRepository.getTableInfoByTableName(tableInfoPayload.manyTableName);
        System.out.println(tableInfoPayload);
        TableConnection tableConnection = new TableConnection(tableInfoOne, tableInfoMany, tableInfoPayload.oneColumnName, tableInfoPayload.manyColumnName);
        tableConnectionRepository.save(tableConnection);
        return "OK";
    }

    @GetMapping("/getconnectedtables/{databasename}/{tablename}/{username}")
    public List<TableInfoPayload> getConnectedTables(@PathVariable("tablename") String tablename, @PathVariable("username") String username, @PathVariable("databasename") String databasename) {
        Long id = tableInfoRepository.getTableIdByTableName(tablename);

        List<Long> availableTables = tableInfoRepository.findAvailableTables(databasename, username);

        List<TableConnection> listOne = tableConnectionRepository.getConnectedTablesOne(id);

        List<TableInfoPayload> retlist = new LinkedList<>();

        for (Long availableId : availableTables) {
            for (TableConnection tableConnectionOne : listOne) {
                if (Objects.equals(tableConnectionOne.many.getId(), availableId)) {
                    System.out.println(tableConnectionOne);
                    retlist.add(
                            new TableInfoPayload(
                                    tableConnectionOne.getOneColumnName(),
                                    tableConnectionOne.getManyColumnName(),
                                    tableConnectionOne.one.getTableName(),
                                    tableConnectionOne.many.getTableName()
                            )
                    );
                }
            }
        }

        return retlist;
    }

    @GetMapping("/getDatabaseConnection/{databaseName}/{username}")
    public List<TableConnectionDTO> getDatabaseConnection(@PathVariable("username") String username, @PathVariable("databaseName") String databaseName) {
        List<TableConnection> tableConnections = tableConnectionRepository.getTableConnectionForDatabase(databaseName, username);

        List<TableConnectionDTO> tableConnectionDTOs = tableConnections.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return tableConnectionDTOs;
    }

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    static class TableConnectionDTO {
        String oneColumnName;
        String manyColumnName;

        String oneTableName;
        String manyTableName;
    }

    // Method to convert TableConnection to TableConnectionDTO
    private TableConnectionDTO convertToDTO(TableConnection tableConnection) {
        TableConnectionDTO dto = new TableConnectionDTO();
        dto.oneColumnName = tableConnection.getOneColumnName();
        dto.manyColumnName = tableConnection.getManyColumnName();

        // Assuming you have a method to get the table name from TableInfo
        dto.oneTableName = tableConnection.getOne().getTableName();
        dto.manyTableName = tableConnection.getMany().getTableName();

        return dto;
    }
    @GetMapping("/checkifhasconnectedtables/{databasename}/{tablename}/{username}")
    public boolean checkIfHasConnectedTables(@PathVariable("tablename") String tablename, @PathVariable("username") String username, @PathVariable("databasename") String databasename) {
        Long id = tableInfoRepository.getTableIdByTableName(tablename);

        List<Long> availableTables = tableInfoRepository.findAvailableTables(databasename, username);

        System.out.println(id + " " + tablename);

        List<TableConnection> listOne = tableConnectionRepository.getConnectedTablesOne(id);

        List<TableConnection> retlist = new LinkedList<>();

        for (Long availableId : availableTables) {
            for (TableConnection tableConnectionOne : listOne) {
                if (Objects.equals(tableConnectionOne.many.getId(), availableId)) {
                    retlist.add(tableConnectionOne);
                    break;
                }
            }
        }

        return retlist.isEmpty();
    }

    @ToString
    @NoArgsConstructor
    @AllArgsConstructor
    @Getter
    @Setter
    static class TableInfoPayload {
        String oneColumnName;
        String manyColumnName;

        String oneTableName;
        String manyTableName;
    }
}
