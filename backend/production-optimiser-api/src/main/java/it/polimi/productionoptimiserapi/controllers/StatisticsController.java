package it.polimi.productionoptimiserapi.controllers;

import it.polimi.productionoptimiserapi.entities.ServiceStatistics;
import it.polimi.productionoptimiserapi.entities.UserStatistics;
import it.polimi.productionoptimiserapi.services.StatisticsService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
public class StatisticsController {

  private final StatisticsService statisticsService;

  @GetMapping("/services/top3")
  public ResponseEntity<List<ServiceStatistics>> getTop3MostInvokedServices() {
    return ResponseEntity.ok(this.statisticsService.getTop3MostInvokedServices());
  }

  @GetMapping("/users/top3")
  public ResponseEntity<List<UserStatistics>> getTop3UsersByLoginCount() {
    return ResponseEntity.ok(this.statisticsService.getTop3UsersByLoginCount());
  }
}
