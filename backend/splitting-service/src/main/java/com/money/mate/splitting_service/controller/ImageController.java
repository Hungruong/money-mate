package com.money.mate.splitting_service.controller;

import com.money.mate.splitting_service.service.ImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = { "http://localhost:8081", "http://localhost:19006", "http://localhost:19000" })
public class ImageController {
    private static final Logger logger = LoggerFactory.getLogger(ImageController.class);
    private final ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile image) {
        try {
            if (image == null || image.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "No image file provided"));
            }

            String contentType = image.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body(Map.of("error", "File must be an image"));
            }

            logger.info("Processing image: {} ({})", image.getOriginalFilename(), image.getContentType());

            Map<String, Object> result = imageService.processImage(image);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error processing image: ", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error processing image: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
}