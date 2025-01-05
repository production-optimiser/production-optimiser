package it.polimi.productionoptimiserapi.services.impl;

import it.polimi.productionoptimiserapi.dtos.OptimizationResultDto;
import it.polimi.productionoptimiserapi.entities.*;
import it.polimi.productionoptimiserapi.mappers.OptimizationResultMapper;
import it.polimi.productionoptimiserapi.repositories.OptimizationResultRepository;
import it.polimi.productionoptimiserapi.services.OptimizationResultService;
import jakarta.transaction.Transactional;
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

  @Override
  @Transactional
  public List<OptimizationResultDto> getAllResults(String userId) {
    log.info("Fetching results for user id=" + userId);
    return resultRepository.findByUserId(userId).stream()
        .map(OptimizationResultMapper::resultToDto)
        .toList();
  }

  @Override
  public OptimizationResultDto getResultById(String resultId) {
    log.info("Fetching result with id=" + resultId);
    return OptimizationResultMapper.resultToDto(
        resultRepository
            .findById(resultId)
            .orElseThrow(
                () -> {
                  String msg = "No result with id=" + resultId;
                  log.warn(msg);
                  return new NoSuchElementException(msg);
                }));
  }

  @Override
  public String saveOptimizationResult(byte[] inputFile, OptimizationResultDto dto, User user) {
    log.info("Saving optimization result");
    return resultRepository
        .save(OptimizationResultMapper.dtoToResult(inputFile, dto, user))
        .getId();
  }

  @Override
  public void deleteAll() {
    log.warn("Deleting all results");
    resultRepository.deleteAll();
  }
}
