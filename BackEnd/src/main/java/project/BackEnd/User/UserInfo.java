package project.BackEnd.User;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import project.BackEnd.OwnershipDetails.OwnershipDetails;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "UserInfo")
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
            name = "user_info_id",
            updatable = false
    )
    Long id;

    @Column(
            name = "username",
            updatable = false,
            nullable = false,
            columnDefinition = "TEXT",
            unique = true
    )
    private String username;

    @Column(
            name = "email",
            updatable = false,
            nullable = false,
            columnDefinition = "TEXT",
            unique = true
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
    @OneToMany(mappedBy = "userInfo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OwnershipDetails> ownershipDetails;

    @Override
    public String toString() {
        final StringBuffer sb = new StringBuffer("UserInfo{");
        sb.append("id=").append(id);
        sb.append(", username='").append(username).append('\'');
        sb.append(", email='").append(email).append('\'');
        sb.append(", password_hash='").append(password_hash).append('\'');
        sb.append('}');
        return sb.toString();
    }

    public UserInfo() {

    }

    public UserInfo(Long id, String username, String email, String password_hash, OwnershipDetails ownershipDetails) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password_hash = password_hash;
        this.ownershipDetails.add(ownershipDetails);
    }

    public UserInfo(String username, String email, String password_hash) {
        this.username = username;
        this.email = email;
        this.password_hash = password_hash;
    }
}
