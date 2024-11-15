package it.polimi.productionoptimiserapi.config;

import it.polimi.productionoptimiserapi.exceptions.ErrorDetails;
import it.polimi.productionoptimiserapi.exceptions.ForbiddenException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.xml.bind.ValidationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class RestControllerExceptionHandler {

  @ExceptionHandler(MissingServletRequestParameterException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ErrorDetails handleMissingServletRequestParameterException(
      MissingServletRequestParameterException ex) {
    return new ErrorDetails(ex);
  }

  @ExceptionHandler(ForbiddenException.class)
  @ResponseStatus(HttpStatus.FORBIDDEN)
  public ErrorDetails handleOAuthException(ForbiddenException ex) {
    return new ErrorDetails(ex);
  }

  @ExceptionHandler(ValidationException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ErrorDetails handleValidationException(ValidationException ex) {
    return new ErrorDetails(ex);
  }

  @ExceptionHandler(EntityNotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public ErrorDetails handleEntityNotFoundException(EntityNotFoundException ex) {
    return new ErrorDetails(ex);
  }

  @ExceptionHandler(Exception.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public final ErrorDetails handleAllExceptions(Exception ex) {
    log.error(ex.getMessage());
    return new ErrorDetails(ex);
  }
}
