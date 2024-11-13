package it.polimi.productionoptimiserapi.services.impl;

import it.polimi.productionoptimiserapi.dto.OptimisationResultDto;
import it.polimi.productionoptimiserapi.entities.OptimizationResult;
import it.polimi.productionoptimiserapi.entities.User;
import it.polimi.productionoptimiserapi.repositories.OptimisationResultRepository;
import it.polimi.productionoptimiserapi.repositories.UserRepository;
import it.polimi.productionoptimiserapi.services.OptimisationResultService;
import java.util.List;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class OptimisatioResulteServiceImpl implements OptimisationResultService {

  private final UserRepository userRepository;
  private final OptimisationResultRepository resultRepository;

  public List<OptimisationResultDto> getAllResults(String userId) {
    User user =
        userRepository
            .findById(userId)
            .orElseThrow(
                () -> new IllegalArgumentException("User with id " + userId + " doesn't exist"));
    List<OptimizationResult> results = resultRepository.findByUser(user);

    List<OptimisationResultDto> resultsDto =
        results.stream()
            .map(
                result ->
                    new OptimisationResultDto(
                        result.getId(),
                        result.getPltData(),
                        result.getNotes(),
                        result.getCreatedAt(),
                        result.getUpdatedAt()))
            .toList();

    return resultsDto;
  }
}
