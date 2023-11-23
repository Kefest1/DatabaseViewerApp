package project.BackEnd.User;


import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import project.BackEnd.OwnershipDetails.OwnershipDetails;

import java.util.Collection;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity(name = "UserInfo")
@Table(
        name = "UserInfo",
        uniqueConstraints = {
                @UniqueConstraint(name = "user_unique", columnNames = "username")
        }
)
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserInfo implements UserDetails {
    public Long getId() {
        return id;
    }

    @Override
    public String getUsername() {
        return email;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword_hash() {
        return password_hash;
    }

    public List<OwnershipDetails> getOwnershipDetails() {
        return ownershipDetails;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(getUsername()));
    }

    @Override
    public String getPassword() {
        return password_hash;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }


    @Id
    @SequenceGenerator(
            name = "userinfo_sequence",
            sequenceName = "userinfo_sequence",
            allocationSize = 1
    )
    @GeneratedValue
    @Column(
            name = "id",
            updatable = false
    )
    private Long id;

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
        sb.append(", username='").append(username).append('\'');
        sb.append(", email='").append(email).append('\'');
        sb.append(", password_hash='").append(password_hash).append('\'');
        sb.append('}');
        return sb.toString();
    }

    public UserInfo(Long id, Long masterID, String username, String email, String password_hash, List<OwnershipDetails> ownershipDetails) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password_hash = password_hash;
        this.ownershipDetails = ownershipDetails;
    }

    public UserInfo(Long masterID, String username, String email, String password_hash) {
        this.username = username;
        this.email = email;
        this.password_hash = password_hash;
    }
}
