package com.golf.golf_project.shared.services;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Transactional
public class UploadService {

    @Value("${SERVER_URL}")
    private String serverUrl;

    public String uploadFile(MultipartFile file) {
        try {
            Path uploadPath = Paths.get("uploads");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String extension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
            String filename = UUID.randomUUID().toString() + extension;

            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return serverUrl + "/uploads/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Could not store file: " + e.getMessage(), e);
        }
    }
}
