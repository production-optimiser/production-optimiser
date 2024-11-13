package it.polimi.productionoptimiserapi.dtos;

import it.polimi.productionoptimiserapi.entities.OptimizationModel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

import java.util.Set;

@Data
public class OptimizationModelDTO {

    @NotBlank(message = "name must be provided")
    public String name;

    @NotBlank(message = "apiUrl must be provided")
    @URL(message = "apiUrl must be a valid URL")
    public String apiUrl;

    @NotEmpty(message = "Optimization model must be associated to at least one user")
    public Set<Long> userIds;

    public OptimizationModel toEntity() {
        OptimizationModel optimizationModel = new OptimizationModel();
        optimizationModel.setName(this.name);
        optimizationModel.setApiUrl(this.apiUrl);
        return optimizationModel;
    }

}
