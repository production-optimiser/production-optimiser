package it.polimi.productionoptimiserapi.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import it.polimi.productionoptimiserapi.enums.GraphType;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "graphs")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Graph extends BaseEntity {

  @Column(length = 10000)
  private String base64EncodedImage;

  @Column(name = "graph_type")
  @Enumerated(EnumType.STRING)
  private GraphType type;

  @ManyToOne
  @JoinColumn(name = "result_id", nullable = false)
  @JsonBackReference
  private OptimizationResult result;

  public Graph(
      String id,
      LocalDateTime createdAt,
      LocalDateTime updatedAt,
      String base64EncodedImage,
      GraphType type) {
    super(id, createdAt, updatedAt);
    this.base64EncodedImage = base64EncodedImage;
    this.type = type;
  }
}
