package it.polimi.productionoptimiserapi.entities;


import com.fasterxml.jackson.annotation.JsonBackReference;
import it.polimi.productionoptimiserapi.enums.GraphType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "graphs")
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Getter
@Setter
public class Graph extends BaseEntity{

    @Column(length = 10000)
    private String base64EncodedImage;

    @Column(name = "graph_type")
    @Enumerated(EnumType.STRING)
    private GraphType type;

    @ManyToOne
    @JoinColumn(name = "result_id", nullable = false)
    @JsonBackReference
    private OptimizationResult result;

}
