package project.BackEnd.TableVisitHistory;

import jakarta.persistence.*;
import lombok.*;
import project.BackEnd.DatabaseInfo.DatabaseInfo;
import project.BackEnd.FieldInfo.FieldInfo;
import project.BackEnd.OwnershipDetails.OwnershipDetails;
import project.BackEnd.Table.TableInfo;
import project.BackEnd.User.UserInfo;

import java.util.Date;
import java.sql.Timestamp;

@Entity
@Table(name = "table_visit_history")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TableVisitHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "table_visit_history_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "table_info_id")
    private TableInfo tableInfo;

    @ManyToOne
    @JoinColumn(name = "user_info_id")
    private UserInfo userInfo;

    @Column(name = "visited_at")
    private Date visitedAt;


    public TableVisitHistory(TableInfo tableInfo, UserInfo userInfo, Date visitedAt) {
        this.tableInfo = tableInfo;
        this.userInfo = userInfo;
        this.visitedAt = visitedAt;
    }
}
