package project.BackEnd.FieldInfo;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import project.BackEnd.Table.TableInfo;

import java.util.List;

@Entity
@Table(name = "field_info")
@Getter
@Setter
@ToString
public class FieldInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data_type")
    private String dataType;

    @Column(name = "column_name")
    private String columnName;

    @Column(name = "data_value", length = 512)
    private String dataValue;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "table_id")
    private TableInfo tableInfo;

    public FieldInfo() {
    }

    public FieldInfo(String dataType, String columnName, String dataValue, TableInfo tableInfo) {
        this.dataType = dataType;
        this.columnName = columnName;
        this.dataValue = dataValue;
        this.tableInfo = tableInfo;
    }
}
