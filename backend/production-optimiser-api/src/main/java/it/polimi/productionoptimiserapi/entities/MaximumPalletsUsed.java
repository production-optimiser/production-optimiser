package it.polimi.productionoptimiserapi.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "defined_pallets")
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Getter
@Setter
public class MaximumPalletsUsed extends BaseEntity {

  @Column private String definedPallets;

  @Column(name = "pallets_count")
  private Integer count;
}
