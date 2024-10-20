package project.BackEnd.User;


import jakarta.persistence.*;
import lombok.*;
import project.BackEnd.OwnershipDetails.OwnershipDetails;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import project.BackEnd.TableVisitHistory.TableVisitHistory;

@Entity
@Table(name = "UserInfo")
@Getter
@Setter
@ToString(exclude = "ownershipDetails")
@NoArgsConstructor
@AllArgsConstructor
public class UserInfo {

    public UserInfo(String username, String email, String password_hash, boolean isAdmin, UserInfo admin) {
        this.username = username;
        this.email = email;
        this.password_hash = password_hash;
        this.isAdmin = isAdmin;
        this.admin = admin;
    }

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
    @Column(
            name = "is_admin",
            updatable = true,
            nullable = true,
            columnDefinition = "BOOLEAN"
    )
    private boolean isAdmin;

    @OneToMany(mappedBy = "userInfo", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<OwnershipDetails> ownershipDetails;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    @JsonIgnore
    private UserInfo admin;

    @OneToMany(mappedBy = "admin")
    @JsonIgnore
    private List<UserInfo> subordinates;


    @OneToMany(mappedBy = "userInfo", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<TableVisitHistory> visitHistory;
}
