package it.polimi.productionoptimiserapi.services;

import it.polimi.productionoptimiserapi.dtos.OptimizationModelDTO;
import it.polimi.productionoptimiserapi.entities.OptimizationModel;

public interface OptimizationModelService {

    OptimizationModel saveOptimizationModel(OptimizationModelDTO optimizationModelDTO);

}
