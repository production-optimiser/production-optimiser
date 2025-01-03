package it.polimi.productionoptimiserapi.services;

import it.polimi.productionoptimiserapi.entities.ServiceStatistics;
import it.polimi.productionoptimiserapi.entities.UserStatistics;
import java.util.List;

public interface StatisticsService {

  List<ServiceStatistics> getTop3MostInvokedServices();

  List<UserStatistics> getTop3UsersByLoginCount();
}
