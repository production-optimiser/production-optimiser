package it.polimi.productionoptimiserapi.services.impl;

import it.polimi.productionoptimiserapi.dto.OptimisationResultDto;
import it.polimi.productionoptimiserapi.repositories.OptimisationResultRepository;
import it.polimi.productionoptimiserapi.repositories.UserRepository;
import it.polimi.productionoptimiserapi.services.OptimisationResultService;
import java.util.Base64;
import java.util.List;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class OptimisatioResulteServiceImpl implements OptimisationResultService {

  private final UserRepository userRepository;
  private final OptimisationResultRepository resultRepository;

  public List<OptimisationResultDto> getAllResults(String userId) {
    return resultRepository.findByUser(userId).stream()
        .map(
            result ->
                new OptimisationResultDto(
                    result.getId(),
                    Base64.getEncoder().encodeToString(result.getPltData()),
                    result.getNotes(),
                    result.getCreatedAt(),
                    result.getUpdatedAt()))
        .toList();
  }
}
