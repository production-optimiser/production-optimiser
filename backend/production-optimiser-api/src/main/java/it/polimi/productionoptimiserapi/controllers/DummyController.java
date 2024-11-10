package it.polimi.productionoptimiserapi.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DummyController {

  @GetMapping
  public String hello() {
    return "Hello, World!";
  }
}
