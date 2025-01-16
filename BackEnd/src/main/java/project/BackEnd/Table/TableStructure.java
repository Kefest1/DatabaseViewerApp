package project.BackEnd.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "table_structure")
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class TableStructure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String columnName;
    private String columnType;

    @ManyToOne
    @JoinColumn(name = "table_info_id")
    @JsonIgnore
    private TableInfo tableInfo;

    public TableStructure(String columnName, String columnType, TableInfo tableInfo) {
        this.columnName = columnName;
        this.columnType = columnType;
        this.tableInfo = tableInfo;
    }
}

enum DataType {
    Long,
    Integer,
    Number,
    Double,
    Boolean,
    String
}
