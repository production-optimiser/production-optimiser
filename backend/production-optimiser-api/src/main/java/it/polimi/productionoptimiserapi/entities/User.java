package it.polimi.productionoptimiserapi.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import it.polimi.productionoptimiserapi.enums.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCrypt;

@Entity
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class User extends BaseEntity implements UserDetails {

  @Column(unique = true)
  @NotNull
  private String email;

  @Column @NotNull @JsonIgnore private String password;

  @Column
  @NotNull
  @Enumerated(EnumType.STRING)
  private UserRole role = UserRole.CUSTOMER;

  @ManyToMany(
      cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
  @JoinTable(
      name = "users_optimization_models",
      joinColumns = @JoinColumn(name = "user_id"),
      inverseJoinColumns = @JoinColumn(name = "optimization_model_id"))
  @JsonManagedReference
  private Set<OptimizationModel> availableOptimizationModels = new HashSet<>();

  @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
  @JsonManagedReference
  private Set<OptimizationResult> optimizationResults = new HashSet<>();

  @PrePersist
  @PreUpdate
  public void onPersistAndUpdate() {
    this.hashPassword();
  }

  private void hashPassword() {
    this.password = BCrypt.hashpw(this.password, BCrypt.gensalt(12));
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    List<SimpleGrantedAuthority> authorities = new ArrayList<>();

    // Add ROLE_ prefix to roles
    if (role == UserRole.ADMIN) {
      authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
    } else {
      authorities.add(new SimpleGrantedAuthority("ROLE_CUSTOMER"));
    }

    return authorities;
  }

  @Override
  public String getUsername() {
    return email;
  }

  @Override
  public boolean isAccountNonExpired() {
    return UserDetails.super.isAccountNonExpired();
  }

  @Override
  public boolean isAccountNonLocked() {
    return UserDetails.super.isAccountNonLocked();
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return UserDetails.super.isCredentialsNonExpired();
  }

  @Override
  public boolean isEnabled() {
    return UserDetails.super.isEnabled();
  }

  public boolean isCustomer() {
    return role == UserRole.CUSTOMER;
  }
}
