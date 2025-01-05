package it.polimi.productionoptimiserapi.services.impl;

import it.polimi.productionoptimiserapi.entities.ServiceStatistics;
import it.polimi.productionoptimiserapi.entities.UserStatistics;
import it.polimi.productionoptimiserapi.enums.ServiceStatisticsType;
import it.polimi.productionoptimiserapi.enums.UserStatisticsType;
import it.polimi.productionoptimiserapi.repositories.ServiceStatisticsRepository;
import it.polimi.productionoptimiserapi.repositories.UserStatisticsRepository;
import it.polimi.productionoptimiserapi.services.StatisticsService;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class StatisticsServiceImpl implements StatisticsService {

  private final UserStatisticsRepository userStatisticsRepository;
  private final ServiceStatisticsRepository serviceStatisticsRepository;

  public StatisticsServiceImpl(
      UserStatisticsRepository userStatisticsRepository,
      ServiceStatisticsRepository serviceStatisticsRepository) {
    this.userStatisticsRepository = userStatisticsRepository;
    this.serviceStatisticsRepository = serviceStatisticsRepository;
  }

  @Override
  public List<ServiceStatistics> getTop3MostInvokedServices() {
    return serviceStatisticsRepository.findTop3ByType(ServiceStatisticsType.INVOCATION_COUNT);
  }

  @Override
  public List<UserStatistics> getTop3UsersByLoginCount() {
    return userStatisticsRepository.findTop3ByType(UserStatisticsType.LOGIN_COUNT);
  }
}
