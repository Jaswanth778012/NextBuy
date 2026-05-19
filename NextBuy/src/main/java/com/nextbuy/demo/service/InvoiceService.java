package com.nextbuy.demo.service;

import java.io.File;
import java.io.FileOutputStream;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.nextbuy.demo.entity.Order;
import com.nextbuy.demo.entity.OrderItem;

@Service
public class InvoiceService {

    public File generateInvoice(Order order) {

        try {

            String fileName =
                    "invoice_" + order.getOrderNumber() + ".pdf";

            File file = new File(fileName);

            Document document = new Document();

            PdfWriter.getInstance(
                    document,
                    new FileOutputStream(file)
            );

            document.open();

            Font titleFont =
                    FontFactory.getFont(
                            FontFactory.HELVETICA_BOLD,
                            24
                    );

            Font headerFont =
                    FontFactory.getFont(
                            FontFactory.HELVETICA_BOLD,
                            12
                    );

            Font normalFont =
                    FontFactory.getFont(
                            FontFactory.HELVETICA,
                            10
                    );

            Paragraph company =
                    new Paragraph(
                            "NEXTBUY",
                            titleFont
                    );

            company.setAlignment(Element.ALIGN_LEFT);

            document.add(company);

            Paragraph invoiceTitle =
                    new Paragraph(
                            "INVOICE",
                            titleFont
                    );

            invoiceTitle.setAlignment(Element.ALIGN_RIGHT);

            document.add(invoiceTitle);

            document.add(new Paragraph(" "));

            PdfPTable infoTable =
                    new PdfPTable(2);

            infoTable.setWidthPercentage(100);

            PdfPCell customerCell =
                    new PdfPCell();

            customerCell.addElement(
                    new Phrase(
                            "Customer Details",
                            headerFont
                    )
            );

            customerCell.addElement(
                    new Phrase(
                            order.getUser().getUsername(),
                            normalFont
                    )
            );

            customerCell.addElement(
                    new Phrase(
                            order.getUser().getEmail(),
                            normalFont
                    )
            );
            
            customerCell.addElement(
					new Phrase(
							order.getShippingAddress().getHouseNo() + "," + order.getShippingAddress().getArea() +"," + order.getShippingAddress().getState() + "," + order.getShippingAddress().getPincode(),
							normalFont
					)
			);

            customerCell.addElement(
                    new Phrase(
                            order.getShippingAddress().getCity(),
                            normalFont
                    )
            );

            PdfPCell invoiceCell =
                    new PdfPCell();

            invoiceCell.addElement(
                    new Phrase(
                            "Invoice Details",
                            headerFont
                    )
            );

            invoiceCell.addElement(
                    new Phrase(
                            "Order No: "
                            + order.getOrderNumber(),
                            normalFont
                    )
            );

            invoiceCell.addElement(
                    new Phrase(
                            "Date: "
                            + order.getOrderedAt()
                                    .format(
                                            DateTimeFormatter.ofPattern(
                                                    "dd-MM-yyyy"
                                            )
                                    ),
                            normalFont
                    )
            );

            invoiceCell.addElement(
                    new Phrase(
                            "Status: "
                            + order.getStatus(),
                            normalFont
                    )
            );

            infoTable.addCell(customerCell);

            infoTable.addCell(invoiceCell);

            document.add(infoTable);

            document.add(new Paragraph(" "));

            PdfPTable table =
                    new PdfPTable(6);

            table.setWidthPercentage(100);

            table.setWidths(
                    new float[]{
                            4,1,2,1,2,2
                    }
            );

            addHeader(table, "Product");
            addHeader(table, "Qty");
            addHeader(table, "Price");
            addHeader(table, "GST%");
            addHeader(table, "GST");
            addHeader(table, "Total");

            for (OrderItem item : order.getOrderItems()) {

                table.addCell(
                        item.getProduct().getName()
                );

                table.addCell(
                        String.valueOf(
                                item.getQuantity()
                        )
                );

                table.addCell(
                        "₹" + item.getFinalPrice()
                );

                table.addCell(
                        item.getGstPercentage() + "%"
                );

                table.addCell(
                        "₹" + item.getGstAmount()
                );

                table.addCell(
                        "₹" + item.getTotalAmount()
                );
            }

            document.add(table);

            document.add(new Paragraph(" "));

            PdfPTable summary =
                    new PdfPTable(2);

            summary.setWidthPercentage(40);

            summary.setHorizontalAlignment(
                    Element.ALIGN_RIGHT
            );

            summary.addCell("Taxable Amount");

            summary.addCell(
                    "₹" + order.getTotalTaxableAmount()
            );

            summary.addCell("GST Amount");

            summary.addCell(
                    "₹" + order.getTotalGstAmount()
            );

            summary.addCell("Shipping");

            summary.addCell(
                    "₹" + order.getShippingCharges()
            );

            summary.addCell("Final Amount");

            summary.addCell(
                    "₹" + order.getFinalPrice()
            );

            document.add(summary);

            document.add(new Paragraph(" "));
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Authorized Signature"));
            
            document.add(new Paragraph(" "));
            document.add(new Paragraph(" "));
            
            Paragraph thanks =
                    new Paragraph(
                            "Thank you for shopping with NextBuy!",
                            titleFont);

            thanks.setAlignment(Element.ALIGN_CENTER);

            document.add(thanks);

            document.close();

            return file;

        } catch (Exception e) {

            throw new RuntimeException(
                    "Invoice generation failed: "
                    + e.getMessage()
            );
        }
    }

    private void addHeader(
            PdfPTable table,
            String title
    ) {

        PdfPCell header =
                new PdfPCell();

        header.setBackgroundColor(
                BaseColor.LIGHT_GRAY
        );

        header.setPhrase(
                new Phrase(title)
        );

        table.addCell(header);
    }
}