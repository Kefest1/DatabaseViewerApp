/**
 * This class created a database information table.
 *
 * @author Szymon Bigoszewski
 * @version 1.0
 */
package project.BackEnd.DatabaseInfo;
import jakarta.persistence.*;
import lombok.*;
import project.BackEnd.Table.TableInfo;

import java.util.Date;
import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "database_info")
@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DatabaseInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "database_id")
    private Long id;

    @Column(name = "database_name")
    private String databaseName;

    @Column(name = "created_at")
    private Timestamp createdAt;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "databaseInfo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TableInfo> tables;

    public DatabaseInfo(String databaseName, String description) {
        this.databaseName = databaseName;
        this.description = description;
    }

    @PrePersist
    public void setDefaultCreatedAt() {
        this.createdAt = new Timestamp(new Date().getTime());
    }
}
