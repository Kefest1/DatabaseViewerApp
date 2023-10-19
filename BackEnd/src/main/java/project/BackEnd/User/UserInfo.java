package project.BackEnd.User;


import jakarta.persistence.*;


@Entity(name = "UserInfo")
@Table(
        name = "UserInfo",
        uniqueConstraints = {
                @UniqueConstraint(name = "user_unique", columnNames = "username")
        }
)
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

    public UserInfo() {
    }

    public Long getMasterID() {
        return masterID;
    }

    public void setMasterID(Long masterID) {
        this.masterID = masterID;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword_hash() {
        return password_hash;
    }

    public void setPassword_hash(String password_hash) {
        this.password_hash = password_hash;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
