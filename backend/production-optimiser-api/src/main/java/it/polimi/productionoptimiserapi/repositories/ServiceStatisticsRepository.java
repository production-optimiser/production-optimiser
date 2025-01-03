package it.polimi.productionoptimiserapi.repositories;

import it.polimi.productionoptimiserapi.entities.ServiceStatistics;
import it.polimi.productionoptimiserapi.enums.ServiceStatisticsType;
import java.util.List;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ServiceStatisticsRepository extends JpaRepository<ServiceStatistics, String> {

  @Query("SELECT s FROM ServiceStatistics s WHERE s.type = :type ORDER BY s.value DESC LIMIT 3")
  List<ServiceStatistics> findTop3ByType(@NonNull ServiceStatisticsType type);
}
