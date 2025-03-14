/**
 * This class defines a field information class.
 *
 * @author Szymon Bigoszewski
 * @version 1.0
 */
package project.BackEnd.FieldInfo;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import project.BackEnd.Table.TableInfo;


@Entity
@Table(name = "field_info")
@Getter
@Setter
@ToString
public class FieldInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "field_id")
    @JsonIgnore
    private Long id;

    @Column(name = "data_type")
    private String dataType;

    @Column(name = "column_id")
    private Long columnId;

    @Column(name = "column_name")
    private String columnName;

    @Column(name = "data_value", length = 512)  // ALTER TABLE field_info ALTER COLUMN data_value TYPE varchar(512);
    private String dataValue;

    @ManyToOne
    @JsonBackReference
    @JsonIgnore
    @JoinColumn(name = "id")
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
