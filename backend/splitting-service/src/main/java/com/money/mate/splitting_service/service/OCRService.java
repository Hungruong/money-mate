package com.money.mate.splitting_service.service;

import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.ClassPathResource;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;

@Service
public class OCRService {
    private final Tesseract tesseract;

    public OCRService() throws IOException {
        tesseract = new Tesseract();
        String tessdataPath = new ClassPathResource("tessdata").getFile().getAbsolutePath();
        tesseract.setDatapath(tessdataPath);
        tesseract.setLanguage("eng+osd");
        tesseract.setPageSegMode(1);
        tesseract.setOcrEngineMode(1);
    }

    public String extractText(MultipartFile file) throws IOException, TesseractException {
        BufferedImage image = ImageIO.read(file.getInputStream());
        if (image == null) {
            throw new IOException("Failed to read image file");
        }
        return tesseract.doOCR(image);
    }

    public String processReceipt(MultipartFile file) throws IOException, TesseractException {
        String rawText = extractText(file);

        // TODO: Add receipt-specific processing
        // - Extract total amount
        // - Extract date
        // - Extract merchant name
        // - Extract line items

        return rawText;
    }
}