package it.polimi.productionoptimiserapi.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "optimization_results")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OptimizationResult extends BaseEntity {

  @Column(name = "name")
  private String name;

  @Column(name = "input_file", columnDefinition = "bytea")
  @Basic(fetch = FetchType.EAGER)
  private byte[] inputFile;

  @Column(name = "input_string")
  private String inputString;

  @Column(name = "output_json", columnDefinition = "jsonb")
  @JdbcTypeCode(SqlTypes.JSON)
  private Map<String, Object> outputJSON;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  @JsonBackReference
  private User user;

  @ManyToOne
  @JoinColumn(name = "optimization_model_id")
  private OptimizationModel optimizationModel;
}
