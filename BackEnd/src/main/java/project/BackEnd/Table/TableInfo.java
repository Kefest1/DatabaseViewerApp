package project.BackEnd.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import project.BackEnd.DatabaseInfo.DatabaseInfo;
import project.BackEnd.FieldInfo.FieldInfo;
import project.BackEnd.OwnershipDetails.OwnershipDetails;
import project.BackEnd.TableVisitHistory.TableVisitHistory;

import org.springframework.data.jpa.repository.JpaRepository;
import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "table_info")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TableInfo {
    @Override
    public String toString() {
        return "TableInfo{" +
                "id=" + id +
                ", tableName='" + tableName + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }

    public TableInfo(DatabaseInfo databaseInfo, String tableName) {
        this.databaseInfo = databaseInfo;
        this.tableName = tableName;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "table_info_id")
    private Long id;

    @OneToMany(mappedBy = "tableInfo", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<OwnershipDetails> ownershipDetails;

    @JoinColumn(name = "database_id")
    @ManyToOne
    @JsonIgnore
    private DatabaseInfo databaseInfo;

    @OneToMany(mappedBy = "tableInfo", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<FieldInfo> fields;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "table_info_id")
    @JsonIgnore
    private List<TableStructure> tableStructure;

    @OneToMany(mappedBy = "tableInfo", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<TableVisitHistory> visitHistory;

    @Column(name = "table_name", length = 255, nullable = false)
    private String tableName;

    @Column(name = "primary_key", length = 255, nullable = true)
    private String primary_key;

    @Column(name = "created_at")
    private Timestamp createdAt;

}
