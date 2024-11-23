package it.polimi.productionoptimiserapi.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "defined_pallets")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ExcelDefinedPallets extends BaseEntity {

  @Column private String definedPallets;

  @Column(name = "pallets_count")
  private Integer count;
}
