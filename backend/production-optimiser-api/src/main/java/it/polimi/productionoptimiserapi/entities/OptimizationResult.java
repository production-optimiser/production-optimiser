package it.polimi.productionoptimiserapi.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "optimization_results")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OptimizationResult extends BaseEntity {

  @Column
  @Lob
  @Basic(fetch = FetchType.EAGER)
  private byte[] inputFile;

  private Double initialTotalProductionTime;
  private Double optimizedTotalProductionTime;
  private Double timeImprovement;
  private Double percentageImprovement;
  private Double averageInitialTotalMachineUtilization;
  private Double averageOptimizedTotalMachineUtilization;
  private Double utilizationImprovement;

  @OneToMany(cascade = CascadeType.ALL)
  private List<ExcelDefinedPallets> palletsDefinedInExcel;

  @OneToMany(cascade = CascadeType.ALL)
  private List<MaximumPalletsUsed> maximumPalletsUsed;

  private Double totalTimeWithOptimizedPallets;
  private Double totalTimeWithExcelPallets;

  private String bestSequenceOfProducts;

  @OneToMany(mappedBy = "result", fetch = FetchType.LAZY)
  private List<Graph> graphs;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  @JsonBackReference
  private User user;
}
