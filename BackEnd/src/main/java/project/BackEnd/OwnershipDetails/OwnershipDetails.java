package project.BackEnd.OwnershipDetails;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.engine.profile.Fetch;
import project.BackEnd.Table.TableInfo;
import project.BackEnd.User.UserInfo;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

@Entity
@Table(name = "ownership_details")
@Getter
@Setter
public class OwnershipDetails {
    @Override
    public String toString() {
        return "OwnershipDetails{" +
                "id=" + id +
                ", user=" + (user != null ? user.getId() : null) +
                ", tableInfo=" + (tableInfo != null ? tableInfo.getId() : null) +
                '}';
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_table_access",
            joinColumns = @JoinColumn(name = "ownership_details_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private UserInfo user;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinTable(name = "ownership_join_table")
    private TableInfo tableInfo;

    public OwnershipDetails() {
    }

    public OwnershipDetails(OwnershipDetails ownershipDetails) {
        ownershipDetails.setId(ownershipDetails.getId());
    }

}
