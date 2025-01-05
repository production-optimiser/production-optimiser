package it.polimi.productionoptimiserapi.repositories;

import it.polimi.productionoptimiserapi.entities.UserStatistics;
import it.polimi.productionoptimiserapi.enums.UserStatisticsType;
import java.util.List;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserStatisticsRepository extends JpaRepository<UserStatistics, String> {

  @Query(
      "SELECT s FROM UserStatistics s WHERE s.type = :type AND s.user.role = 'CUSTOMER' ORDER BY s.value DESC LIMIT 3")
  List<UserStatistics> findTop3ByType(@NonNull UserStatisticsType type);

  List<UserStatistics> findUserStatisticsByUserId(@NonNull String userId);
}
