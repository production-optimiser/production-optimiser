package it.polimi.productionoptimiserapi.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import it.polimi.productionoptimiserapi.enums.ServiceStatisticsType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "service_statistics")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ServiceStatistics extends BaseEntity {

  @Column
  @NotNull
  @Enumerated(EnumType.STRING)
  private ServiceStatisticsType type;

  @Column @NotNull private int value;

  @ManyToOne
  @JoinColumn(name = "service_id", nullable = false)
  @JsonBackReference
  private OptimizationModel service;

  @Transient
  @JsonInclude
  @JsonProperty("serviceName")
  public String getServiceName() {
    return this.service != null ? this.service.getName() : null;
  }
}
