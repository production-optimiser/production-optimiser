package it.polimi.productionoptimiserapi.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class OptimisationResultDto {

  private String id;
  private byte[] pltData;
  private String notes;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
