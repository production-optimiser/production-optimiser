package it.polimi.productionoptimiserapi.entities;

import it.polimi.productionoptimiserapi.config.Constants;
import jakarta.servlet.http.HttpServletResponse;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public abstract class BaseAuditFile {
  public XSSFWorkbook workbook;
  public XSSFSheet sheet;

  public void newAuditExcel() {
    workbook = new XSSFWorkbook();
  }

  public HttpServletResponse initResponseFoExportExcel(
      HttpServletResponse response, String fileName) {
    response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    DateFormat dateFormat = new SimpleDateFormat(Constants.DATETIME_FORMAT);
    String currentDate = dateFormat.format(new Date());

    String headerKey = "Content-Disposition";
    String headerValue = "attachment; filename=" + fileName + "_" + currentDate + ".xlsx";
    response.setHeader(headerKey, headerValue);
    return response;
  }

  public void writeTableHeaderExcel(String sheetName, String titleName, String[] headers) {
    sheet = workbook.createSheet(sheetName);
    Row row = sheet.createRow(0);
    CellStyle style = workbook.createCellStyle();
    XSSFFont font = workbook.createFont();
    font.setBold(true);
    font.setFontHeight(20);
    style.setFont(font);
    style.setAlignment(HorizontalAlignment.CENTER);

    createCell(row, 0, titleName, style);
    sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, headers.length - 1));
    font.setFontHeightInPoints((short) 10);

    row = sheet.createRow(1);
    font.setBold(true);
    font.setFontHeight(16);
    style.setFont(font);
    for (int i = 0; i < headers.length; i++) {
      createCell(row, i, headers[i], style);
    }
  }

  public void createCell(Row row, int columnCount, Object value, CellStyle style) {
    sheet.autoSizeColumn(columnCount);
    Cell cell = row.createCell(columnCount);
    switch (value) {
      case Integer i -> cell.setCellValue(i);
      case Double v -> cell.setCellValue(v);
      case Boolean b -> cell.setCellValue(b);
      case Date date -> cell.setCellValue(date);
      case Long l -> cell.setCellValue(l);
      case null, default -> cell.setCellValue((String) value);
    }
    cell.setCellStyle(style);
  }

  public CellStyle getFontContentExcel() {
    CellStyle style = workbook.createCellStyle();
    XSSFFont font = workbook.createFont();
    font.setFontHeight(14);
    style.setFont(font);
    return style;
  }
}
