package it.polimi.productionoptimiserapi.exceptions;

import static it.polimi.productionoptimiserapi.config.Constants.DATETIME_FORMAT;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.Clock;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ErrorDetails {

  @JsonFormat(pattern = DATETIME_FORMAT)
  private LocalDateTime timestamp;

  private String type;

  private String message;

  public ErrorDetails(Exception ex) {
    this.timestamp = LocalDateTime.now(Clock.systemDefaultZone());
    this.type = ex.getClass().getName();
    this.message = ex.getMessage();
  }
}
