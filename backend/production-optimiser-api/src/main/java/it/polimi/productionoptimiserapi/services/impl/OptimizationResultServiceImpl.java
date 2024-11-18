package it.polimi.productionoptimiserapi.services.impl;

import it.polimi.productionoptimiserapi.dto.OptimizationResultDto;
import it.polimi.productionoptimiserapi.repositories.OptimizationResultRepository;
import it.polimi.productionoptimiserapi.services.OptimizationResultService;
import java.util.Base64;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class OptimizationResultServiceImpl implements OptimizationResultService {

  private final OptimizationResultRepository resultRepository;

  public List<OptimizationResultDto> getAllResults(String userId) {
    return resultRepository.findByUser(userId).stream()
        .map(
            result ->
                new OptimizationResultDto(
                    result.getId(),
                    Base64.getEncoder().encodeToString(result.getPltData()),
                    result.getNotes(),
                    result.getCreatedAt(),
                    result.getUpdatedAt()))
        .toList();
  }
}
