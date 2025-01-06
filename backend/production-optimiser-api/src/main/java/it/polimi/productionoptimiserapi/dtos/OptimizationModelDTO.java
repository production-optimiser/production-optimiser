package it.polimi.productionoptimiserapi.dtos;

import it.polimi.productionoptimiserapi.entities.OptimizationModel;
import it.polimi.productionoptimiserapi.enums.InputType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

@Data
@Builder
public class OptimizationModelDTO {

  @NotBlank(message = "name must be provided")
  public String name;

  @NotBlank(message = "apiUrl must be provided")
  @URL(message = "apiUrl must be a valid URL")
  public String apiUrl;

  @NotNull(message = "inputType must be provided")
  public InputType inputType;

  public OptimizationModel toEntity() {
    OptimizationModel optimizationModel = new OptimizationModel();
    optimizationModel.setName(this.name);
    optimizationModel.setApiUrl(this.apiUrl);
    optimizationModel.setInputType(this.inputType);
    return optimizationModel;
  }
}
