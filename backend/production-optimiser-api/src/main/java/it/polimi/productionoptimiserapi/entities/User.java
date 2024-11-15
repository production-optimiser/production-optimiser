package it.polimi.productionoptimiserapi.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import it.polimi.productionoptimiserapi.enums.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.crypto.bcrypt.BCrypt;

@Entity
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class User extends BaseEntity {

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
}
