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
    return resultRepository.findByUserId(userId).stream()
        .map(OptimizationResultMapper::resultToDto)
        .toList();
  }

  @Override
  public OptimizationResultDto getResultById(String resultId) {
    return OptimizationResultMapper.resultToDto(
        resultRepository
            .findById(resultId)
            .orElseThrow(
                () -> new NoSuchElementException("No result with id=" + resultId + " exists")));
  }

  @Override
  public String saveOptimizationResult(byte[] inputFile, String inputString, OptimizationResultDto dto, User user) {
    return resultRepository
        .save(OptimizationResultMapper.dtoToResult(inputFile, inputString, dto, user))
        .getId();
  }

  @Override
  public void deleteAll() {
    resultRepository.deleteAll();
  }
}
