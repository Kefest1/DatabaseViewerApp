package project.BackEnd.Table;

import jakarta.persistence.*;
import lombok.ToString;
import project.BackEnd.DatabaseInfo.DatabaseInfo;
import project.BackEnd.FieldInfo.FieldInfo;
import project.BackEnd.OwnershipDetails.OwnershipDetails;

import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "table_info")
@ToString
public class TableInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToMany(targetEntity = OwnershipDetails.class, cascade = CascadeType.MERGE)
    @JoinColumn(name = "database_id", unique = false)
    private List<OwnershipDetails> ownershipDetails;

    @ManyToOne
    @JoinColumn(name = "database_id")
    private DatabaseInfo databaseInfo;

    @OneToMany(mappedBy = "tableInfo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FieldInfo> fields;

    @Column(name = "table_name", length = 255, nullable = false)
    private String tableName;

    @Column(name = "created_at")
    private Timestamp createdAt;

    public TableInfo() {
        // Default constructor
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public DatabaseInfo getDatabaseInfo() {
        return databaseInfo;
    }

    public void setDatabaseInfo(DatabaseInfo databaseInfo) {
        this.databaseInfo = databaseInfo;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}
