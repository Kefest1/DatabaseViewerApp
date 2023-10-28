package project.BackEnd.OwnershipDetails;
import jakarta.persistence.*;
import project.BackEnd.Table.TableInfo;
import project.BackEnd.User.UserInfo;

@Entity
@Table(name = "ownership_details")
public class OwnershipDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ownership_details_id")
    private Long id;

    @Column(name = "access_level")
    private Integer access_level;

    @OneToOne(
            cascade = {
                    CascadeType.ALL,
                    CascadeType.MERGE
            },
            fetch = FetchType.LAZY,
            orphanRemoval = true
    )
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserInfo user;

    @OneToOne(
        cascade = {
            CascadeType.MERGE
        },
        fetch = FetchType.LAZY,
        orphanRemoval = true
    )
    @JoinColumn(name = "table_id", referencedColumnName = "id")
    private TableInfo tableInfo;

    public OwnershipDetails() {
    }

    public OwnershipDetails(OwnershipDetails ownershipDetails) {
        ownershipDetails.setId(ownershipDetails.getId());
        ownershipDetails.setAccess_level(ownershipDetails.getAccess_level());
    }

    public OwnershipDetails(Long id, Integer access_level, UserInfo user, TableInfo tableInfo) {
        this.id = id;
        this.access_level = access_level;
        this.user = user;
        this.tableInfo = tableInfo;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getAccess_level() {
        return access_level;
    }

    public void setAccess_level(Integer access_level) {
        this.access_level = access_level;
    }

    public UserInfo getUser() {
        return user;
    }

    public void setUser(UserInfo user) {
        this.user = user;
    }

    public TableInfo getTableInfo() {
        return tableInfo;
    }

    public void setTableInfo(TableInfo tableInfo) {
        this.tableInfo = tableInfo;
    }

    @Override
    public String toString() {
        final StringBuffer sb = new StringBuffer("OwnershipDetails{");
        sb.append("id=").append(id);
        sb.append(", access_level=").append(access_level);
        sb.append(", user=").append(user);
        sb.append(", tableInfo=").append(tableInfo);
        sb.append('}');
        return sb.toString();
    }

}
