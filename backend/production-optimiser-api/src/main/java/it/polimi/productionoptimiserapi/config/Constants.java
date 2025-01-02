package it.polimi.productionoptimiserapi.config;

import java.util.Set;

public class Constants {

  public static final String DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";

  // EMAIL
  public static final String EMAIL_SUBJECT_NEW_ACCOUNT = "ProductionOptimiser: Account created";
  public static final String EMAIL_SUBJECT_DENIED_ACCOUNT =
      "ProductionOptimiser: Account request denied";
  public static final String EMAIL_BODY_NEW_ACCOUNT =
      "Your account was successfully created. Your assigned password is: ";
  public static final String EMAIL_BODY_DENIED_ACCOUNT =
      "We regret to inform you that your account request was denied for the following reason: ";
  public static final Set<String> ALLOWED_IMAGE_EXTENSIONS = Set.of("jpg", "jpeg", "png", "gif");
  public static final Set<String> ALLOWED_FILE_EXTENSIONS = Set.of("csv", "json", "xls", "xlsx", "txt");
}
