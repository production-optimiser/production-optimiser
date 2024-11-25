package it.polimi.productionoptimiserapi.mappers;

import java.io.IOException;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.web.multipart.MultipartFile;

public class MultipartFileResource extends ByteArrayResource {

  private final MultipartFile file;

  public MultipartFileResource(MultipartFile file) {
    super(getBytes(file));
    this.file = file;
  }

  @Override
  public String getFilename() {
    return file.getOriginalFilename();
  }

  private static byte[] getBytes(MultipartFile file) {
    try {
      return file.getBytes();
    } catch (IOException e) {
      throw new RuntimeException("Failed to read bytes from MultipartFile", e);
    }
  }
}
