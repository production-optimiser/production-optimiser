package it.polimi.productionoptimiserapi.services.impl;

import it.polimi.productionoptimiserapi.entities.BaseAuditFile;
import it.polimi.productionoptimiserapi.entities.OptimizationResult;
import it.polimi.productionoptimiserapi.services.UserAuditService;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Set;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.springframework.stereotype.Service;

@Service
public class UserAuditServiceImpl extends BaseAuditFile implements UserAuditService {
  @Override
  public void exportAuditToExcel(
      HttpServletResponse response, Set<OptimizationResult> optimizationResults)
      throws IOException {
    newAuditExcel();
    response = initResponseFoExportExcel(response, "UserAudit");
    ServletOutputStream outputStream = response.getOutputStream();

    String[] headers =
        new String[] {"resultId", "resultName", "modelName", "createdAt", "updatedAt"};
    writeTableHeaderExcel("Sheet User", "Audit User", headers);

    writeTableData(optimizationResults);
    workbook.write(outputStream);
    workbook.close();
    outputStream.close();
  }

  private void writeTableData(Set<OptimizationResult> optimizationResults) {
    CellStyle style = getFontContentExcel();
    int startRow = 2;

    for (OptimizationResult optimizationResult : optimizationResults) {
      Row row = sheet.createRow(startRow++);
      int columnIndex = 0;
      createCell(row, columnIndex++, optimizationResult.getId(), style);
      createCell(row, columnIndex++, optimizationResult.getName(), style);
      createCell(row, columnIndex++, optimizationResult.getOptimizationModel().getName(), style);
      createCell(row, columnIndex++, optimizationResult.getCreatedAt().toString(), style);
      createCell(row, columnIndex++, optimizationResult.getUpdatedAt().toString(), style);
    }
  }
}
