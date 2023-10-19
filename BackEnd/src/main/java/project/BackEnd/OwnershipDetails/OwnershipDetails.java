package project.BackEnd.OwnershipDetails;
import jakarta.persistence.*;
import project.BackEnd.Table.TableInfo;
import project.BackEnd.User.UserInfo;

@Entity
@Table(name = "ownership_details")
public class OwnershipDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "level")
    private Integer level;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserInfo user;

    @ManyToOne
    @JoinColumn(name = "database_id")
    private TableInfo tableInfo;

    // Constructors, getters, and setters
}
