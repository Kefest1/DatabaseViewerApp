/**
 * This class defines a ownership details between users and their tables.
 *
 * @author Szymon Bigoszewski
 * @version 1.0
 */
package project.BackEnd.OwnershipDetails;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import project.BackEnd.Table.TableInfo;
import project.BackEnd.User.UserInfo;


@Entity
@Table(name = "ownership_details")
@Getter
@Setter
@ToString(exclude = "userInfo")
public class OwnershipDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ownership_details_id")
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_table_access",
            joinColumns = @JoinColumn(name = "ownership_details_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @JsonIgnore
    private UserInfo userInfo;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinTable(name = "ownership_join_table")
    @JsonIgnore
    private TableInfo tableInfo;

    public OwnershipDetails() {
        userInfo = new UserInfo();
        tableInfo = new TableInfo();
    }

    @Column(
            name = "access_level",
            nullable = true
    )
    private Integer accessLevel;

//    public OwnershipDetails(OwnershipDetails ownershipDetails) {
//        ownershipDetails.setId(ownershipDetails.getId());
//    }

}
