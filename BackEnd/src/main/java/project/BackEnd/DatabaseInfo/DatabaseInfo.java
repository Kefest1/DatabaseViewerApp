package project.BackEnd.DatabaseInfo;
import jakarta.persistence.*;
import lombok.Getter;

import java.sql.Timestamp;

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

    public DatabaseInfo() {
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
}
