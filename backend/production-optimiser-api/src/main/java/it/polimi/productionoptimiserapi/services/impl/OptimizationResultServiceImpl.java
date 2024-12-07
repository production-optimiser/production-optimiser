package it.polimi.productionoptimiserapi.services.impl;

import it.polimi.productionoptimiserapi.dto.OptimizationResultDto;
import it.polimi.productionoptimiserapi.entities.OptimizationResult;
import it.polimi.productionoptimiserapi.repositories.OptimizationResultRepository;
import it.polimi.productionoptimiserapi.services.OptimizationResultService;
import java.util.List;
import java.util.NoSuchElementException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class OptimizationResultServiceImpl implements OptimizationResultService {

  private final OptimizationResultRepository resultRepository;

  public List<OptimizationResultDto> getAllResults(String userId) {
    return resultRepository.findByUserId(userId).stream()
        .map(OptimizationResultServiceImpl::resultToDto)
        .toList();
  }

  @Override
  public OptimizationResultDto getResultById(String resultId) {
    return resultToDto(
        resultRepository
            .findById(resultId)
            .orElseThrow(
                () -> new NoSuchElementException("No result with id=" + resultId + " exists")));
  }

  private static OptimizationResultDto resultToDto(OptimizationResult result) {
    return new OptimizationResultDto(
        result.getId(), result.getCreatedAt(), result.getUpdatedAt(), result.getOutputJSON());
  }
}
