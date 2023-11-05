package project.BackEnd.DatabaseInfo;
import jakarta.persistence.*;
import project.BackEnd.Table.TableInfo;

import java.util.Date;
import java.sql.Timestamp;
import java.util.List;

@Entity(name = "database_info")
@Table
public class DatabaseInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "database_id")
    private Long id;

    @Column(name = "database_name")
    private String databaseName;

    @Column(name = "created_at")
    private Timestamp createdAt;

    @OneToMany(mappedBy = "databaseInfo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TableInfo> tables;

    public DatabaseInfo() {
    }

    public List<TableInfo> getTables() {
        return tables;
    }

    public void setTables(List<TableInfo> tables) {
        this.tables = tables;
    }

    public Long getId() {
        return id;
    }

    public String getDatabaseName() {
        return databaseName;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setDatabaseName(String databaseName) {
        this.databaseName = databaseName;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    @PrePersist
    public void setDefaultCreatedAt() {
        this.createdAt = new Timestamp(new Date().getTime());
    }
}
