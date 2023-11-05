package project.BackEnd.OwnershipDetails;
import jakarta.persistence.*;
import lombok.Getter;
import project.BackEnd.Table.TableInfo;
import project.BackEnd.User.UserInfo;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

@Entity
@Table(name = "ownership_details")
public class OwnershipDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "access_level")
    private Integer access_level;

    @ManyToMany
    @JoinTable(
            name = "user_table_access",
            joinColumns = @JoinColumn(name = "ownership_details_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<UserInfo> users = new ArrayList<>();

    @ManyToMany(mappedBy = "ownershipDetails")
    private List<TableInfo> tables = new ArrayList<>();

    public OwnershipDetails() {
    }

    public OwnershipDetails(OwnershipDetails ownershipDetails) {
        ownershipDetails.setId(ownershipDetails.getId());
        ownershipDetails.setAccess_level(ownershipDetails.getAccess_level());
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

    public List<UserInfo> getUsers() {
        return users;
    }

    public void setUsers(List<UserInfo> users) {
        this.users = users;
    }

    public List<TableInfo> getTables() {
        return tables;
    }

    public void setTables(List<TableInfo> tables) {
        this.tables = tables;
    }
}
