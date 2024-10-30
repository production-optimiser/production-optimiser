package it.polimi.productionoptimiserapi.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.hibernate.validator.constraints.Length;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "optimization_models")
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
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

    @ManyToMany(mappedBy = "availableOptimizationModels")
    @JsonBackReference
    private Set<User> users = new HashSet<>();

}
