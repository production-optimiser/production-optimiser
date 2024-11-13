package it.polimi.productionoptimiserapi.services.impl;

import it.polimi.productionoptimiserapi.dtos.OptimizationModelDTO;
import it.polimi.productionoptimiserapi.entities.OptimizationModel;
import it.polimi.productionoptimiserapi.entities.User;
import it.polimi.productionoptimiserapi.repositories.OptimizationModelRepository;
import it.polimi.productionoptimiserapi.repositories.UserRepository;
import it.polimi.productionoptimiserapi.services.OptimizationModelService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class OptimizationModelServiceImpl implements OptimizationModelService {

    private final OptimizationModelRepository optimizationModelRepository;

    private final UserRepository userRepository;

    public OptimizationModelServiceImpl(
        OptimizationModelRepository optimizationModelRepository,
        UserRepository userRepository
    ) {
        this.optimizationModelRepository = optimizationModelRepository;
        this.userRepository = userRepository;
    }

    private Set<User> mapUserIdsToUsers(Set<Long> userIds) throws EntityNotFoundException {
        return userIds.stream()
            .map(userId ->
                this.userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found by id " + userId))
            ).collect(Collectors.toSet());
    }

    public OptimizationModel saveOptimizationModel(OptimizationModelDTO optimizationModelDTO) throws EntityNotFoundException {
        OptimizationModel om = optimizationModelDTO.toEntity();
        om.setUsers(this.mapUserIdsToUsers(optimizationModelDTO.getUserIds()));
        return this.optimizationModelRepository.save(om);
    }

}
