package it.polimi.productionoptimiserapi.mappers;

import it.polimi.productionoptimiserapi.dtos.OptimizationResultDto;
import it.polimi.productionoptimiserapi.entities.*;

import java.util.Arrays;

public class OptimizationResultMapper {
  public static OptimizationResult dtoToResult(
      byte[] inputFile, OptimizationResultDto dto, User user) {
    return new OptimizationResult(inputFile, dto.getOutputJSON(), user);
  }

  public static OptimizationResultDto resultToDto(OptimizationResult result) {
    return new OptimizationResultDto(
        result.getId(),
        result.getCreatedAt(),
        result.getUpdatedAt(),
        result.getOutputJSON(),
        result.getUser().getId(),
        result.getInputFile()
    );
  }
}
