package project.BackEnd.FieldInfo;
import jakarta.persistence.*;
import project.BackEnd.Table.TableInfo;

@Entity
@Table(name = "field_info")
public class FieldInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "table_id")
    private TableInfo tableInfo; // Reference to the table_info table

    @Column(name = "column_name")
    private String columnName;

    @Column(name = "column_id")
    private Integer columnId;

    @Column(name = "data_type")
    private String dataType;

    @Column(columnDefinition = "jsonb")
    private String dataValue;

    public FieldInfo() {
    }

    public TableInfo getTableInfo() {
        return tableInfo;
    }

    public void setTableInfo(TableInfo tableInfo) {
        this.tableInfo = tableInfo;
    }

    public String getColumnName() {
        return columnName;
    }

    public void setColumnName(String columnName) {
        this.columnName = columnName;
    }

    public Integer getColumnId() {
        return columnId;
    }

    public void setColumnId(Integer columnId) {
        this.columnId = columnId;
    }

    public String getDataValue() {
        return dataValue;
    }

    public void setDataValue(String dataValue) {
        this.dataValue = dataValue;
    }
}
