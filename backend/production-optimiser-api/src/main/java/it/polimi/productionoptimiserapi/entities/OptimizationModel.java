package it.polimi.productionoptimiserapi.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import it.polimi.productionoptimiserapi.enums.InputType;
import it.polimi.productionoptimiserapi.enums.OptimizationModelStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "optimization_models")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OptimizationModel extends BaseEntity {

  @Column(unique = true)
  @NotNull
  @Size(min = 1, max = 100)
  private String name;

  @Column
  @NotNull
  @Size(min = 1, max = 100)
  private String apiUrl;

  @Column
  @NotNull
  @Enumerated(EnumType.STRING)
  private InputType inputType;

  @Column
  @NotNull
  @Enumerated(EnumType.STRING)
  private OptimizationModelStatus status = OptimizationModelStatus.ACTIVE;

  @ManyToMany(mappedBy = "availableOptimizationModels")
  @JsonBackReference
  private Set<User> users = new HashSet<>();

  @OneToMany(mappedBy = "service")
  @JsonBackReference
  private Set<ServiceStatistics> statistics = new HashSet<>();
}
