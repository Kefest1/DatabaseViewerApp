package project.BackEnd.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import project.BackEnd.DatabaseInfo.DatabaseInfo;
import project.BackEnd.FieldInfo.FieldInfo;
import project.BackEnd.OwnershipDetails.OwnershipDetails;

import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "table_info")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TableInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "table_info_id")
    private Long id;

    @JsonIgnore
    @OneToMany(mappedBy = "tableInfo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OwnershipDetails> ownershipDetails;

    @JoinColumn(name = "database_id")
    @JsonIgnore
    @ManyToOne
    private DatabaseInfo databaseInfo;

    @OneToMany(mappedBy = "tableInfo", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<FieldInfo> fields;

    @Column(name = "table_name", length = 255, nullable = false)
    private String tableName;

    @Column(name = "created_at")
    private Timestamp createdAt;

    @Override
    public String toString() {
        System.out.println("--------------------------");
        return "TableInfo{" +
                "id=" + id +
                ", databaseInfo=" + (databaseInfo != null ? databaseInfo.getId() : null) +
                ", tableName='" + tableName + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
