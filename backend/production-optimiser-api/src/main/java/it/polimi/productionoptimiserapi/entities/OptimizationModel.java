package it.polimi.productionoptimiserapi.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import it.polimi.productionoptimiserapi.enums.OptimizationModelStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

@Entity
@Table(name = "optimization_models")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OptimizationModel extends BaseEntity {

  @Column(unique = true)
  @NotNull
  @Length(min = 1, max = 100)
  private String name;

  @Column
  @NotNull
  private String apiUrl;

  @Column
  @NotNull
  @Enumerated(EnumType.STRING)
  private OptimizationModelStatus status = OptimizationModelStatus.ACTIVE;

  @ManyToMany(mappedBy = "availableOptimizationModels")
  @JsonBackReference
  private Set<User> users = new HashSet<>();
}
