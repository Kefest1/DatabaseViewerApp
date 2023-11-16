package project.BackEnd.User;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import project.BackEnd.OwnershipDetails.OwnershipDetails;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity(name = "UserInfo")
@Table(
        name = "UserInfo",
        uniqueConstraints = {
                @UniqueConstraint(name = "user_unique", columnNames = "username")
        }
)
@Getter
@Setter
public class UserInfo {

    @Id
    @SequenceGenerator(
            name = "userinfo_sequence",
            sequenceName = "userinfo_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "userinfo_sequence"
    )
    @Column(
            name = "id",
            updatable = false
    )
    private Long id;

    @Column(
            name = "masterID",
            updatable = true,
            nullable = false
    )
    private Long masterID;

    @Column(
            name = "username",
            updatable = false,
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String username;

    @Column(
            name = "email",
            updatable = false,
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String email;


    @Column(
            name = "password_hash",
            updatable = true,
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String password_hash;

    @JsonIgnore
    @OneToMany(mappedBy = "user")
    private List<OwnershipDetails> ownershipDetails;

    @Override
    public String toString() {
        final StringBuffer sb = new StringBuffer("UserInfo{");
        sb.append("id=").append(id);
        sb.append(", masterID=").append(masterID);
        sb.append(", username='").append(username).append('\'');
        sb.append(", email='").append(email).append('\'');
        sb.append(", password_hash='").append(password_hash).append('\'');
        sb.append('}');
        return sb.toString();
    }

    public UserInfo() {

    }

    public UserInfo(Long id, Long masterID, String username, String email, String password_hash, List<OwnershipDetails> ownershipDetails) {
        this.id = id;
        this.masterID = masterID;
        this.username = username;
        this.email = email;
        this.password_hash = password_hash;
        this.ownershipDetails = ownershipDetails;
    }

    public UserInfo(Long masterID, String username, String email, String password_hash) {
        this.masterID = masterID;
        this.username = username;
        this.email = email;
        this.password_hash = password_hash;
    }
}
