package it.polimi.productionoptimiserapi.exceptions;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Clock;
import java.time.LocalDateTime;

import static it.polimi.productionoptimiserapi.config.Constants.DATETIME_FORMAT;

@Data
@AllArgsConstructor
public class ErrorDetails {

    @JsonFormat(pattern=DATETIME_FORMAT)
    private LocalDateTime timestamp;

    private String type;

    private String message;

    public ErrorDetails(Exception ex) {
        this.timestamp = LocalDateTime.now(Clock.systemDefaultZone());
        this.type = ex.getClass().getName();
        this.message = ex.getMessage();
    }

}
