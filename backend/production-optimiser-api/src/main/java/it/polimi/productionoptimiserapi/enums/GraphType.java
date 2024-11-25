package it.polimi.productionoptimiserapi.enums;

public enum GraphType {
  OCCUPANCY_GRAPH,
  MACHINE_UTILIZATION,
  PRODUCT_FLOW,
  PALLET_GRAPH;

  public static GraphType fromKey(String key) {
    return switch (key) {
      case "occupancy_graph" -> OCCUPANCY_GRAPH;
      case "machine_utilization" -> MACHINE_UTILIZATION;
      case "product_flow" -> PRODUCT_FLOW;
      case "pallet_graph" -> PALLET_GRAPH;
      default -> null;
    };
  }
}
