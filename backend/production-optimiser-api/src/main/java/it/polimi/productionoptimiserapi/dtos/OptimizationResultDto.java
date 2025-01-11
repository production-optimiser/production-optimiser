package it.polimi.productionoptimiserapi.dtos;

import java.time.LocalDateTime;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class OptimizationResultDto {
  private String id;
  private String name;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
  private Map<String, Object> outputJSON;
  private String userId;
  private byte[] inputFile;
  private String inputString;
}
