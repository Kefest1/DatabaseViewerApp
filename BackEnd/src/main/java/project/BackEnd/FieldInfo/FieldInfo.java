package project.BackEnd.FieldInfo;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import project.BackEnd.Table.TableInfo;

import java.util.List;

@Entity
@Table(name = "field_info")
@Getter
@Setter
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
    @JsonBackReference
    @JoinColumn(name = "table_id")
    private TableInfo tableInfo;

    public FieldInfo() {
    }

}
