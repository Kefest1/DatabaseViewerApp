package project.BackEnd.FieldInfo;
import jakarta.persistence.*;
import project.BackEnd.Table.TableInfo;

import java.util.List;

@Entity
@Table(name = "field_info")
public class FieldInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data_type")
    private String dataType;

    @Column(name = "column_name")
    private String column_name;

    @Column(name = "data_value", length = 512)
    private String dataValue;

    @ManyToOne
    @JoinColumn(name = "table_id")
    private TableInfo tableInfo;

    public FieldInfo() {
    }

    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    public String getDataValue() {
        return dataValue;
    }

    public void setDataValue(String dataValue) {
        this.dataValue = dataValue;
    }
}
