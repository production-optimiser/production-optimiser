package it.polimi.productionoptimiserapi.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class KeyValueDTO {
  private String key;
  private String value;
}
