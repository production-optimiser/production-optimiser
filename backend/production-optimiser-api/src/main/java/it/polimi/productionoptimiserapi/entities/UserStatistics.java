package it.polimi.productionoptimiserapi.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import it.polimi.productionoptimiserapi.enums.UserStatisticsType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user_statistics")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserStatistics extends BaseEntity {

  @Column
  @NotNull
  @Enumerated(EnumType.STRING)
  private UserStatisticsType type;

  @Column @NotNull private int value;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  @JsonBackReference
  private User user;

  @Transient
  @JsonInclude
  @JsonProperty("username")
  public String getUserName() {
    return this.user != null ? this.user.getUsername() : null;
  }
}
