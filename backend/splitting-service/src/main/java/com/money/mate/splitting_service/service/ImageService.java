package com.money.mate.splitting_service.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.IOException;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.List;
import net.sourceforge.tess4j.TesseractException;

@Service
public class ImageService {
    private static final Logger logger = LoggerFactory.getLogger(ImageService.class);

    @Autowired
    private OCRService ocrService;

    public Map<String, Object> processImage(MultipartFile image) throws IOException {
        try {
            // Process the receipt with OCR
            String extractedText = ocrService.processReceipt(image);
            logger.info("Extracted text: {}", extractedText);

            // Create a structured response
            Map<String, Object> result = new HashMap<>();
            List<Map<String, Object>> items = new ArrayList<>();

            // For now, return mock data along with the raw text
            Map<String, Object> item = new HashMap<>();
            item.put("name", "Sample Item");
            item.put("price", 10.99);
            item.put("quantity", 1);
            items.add(item);

            result.put("items", items);
            result.put("total", 10.99);
            result.put("merchantName", "Sample Store");
            result.put("date", "2024-03-21");
            result.put("rawText", extractedText);

            return result;
        } catch (TesseractException e) {
            logger.error("OCR processing failed: ", e);
            throw new IOException("Failed to process image with OCR: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error during image processing: ", e);
            throw new IOException("Unexpected error during image processing: " + e.getMessage());
        }
    }
}