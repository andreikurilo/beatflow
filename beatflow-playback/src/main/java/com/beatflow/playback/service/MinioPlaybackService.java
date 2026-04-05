package com.beatflow.playback.service;

import com.beatflow.playback.config.MinioProperties;
import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.StatObjectArgs;
import io.minio.StatObjectResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.InputStream;

@Service
@RequiredArgsConstructor
public class MinioPlaybackService {

    private final MinioClient minioClient;
    private final MinioProperties minioProperties;

    public StatObjectResponse stat(String objectKey) {
        try {
            return minioClient.statObject(StatObjectArgs.builder()
                                                        .bucket(minioProperties.getBucket())
                                                        .object(objectKey)
                                                        .build());
        } catch (Exception e) {
            throw new RuntimeException("Failed to stat object", e);
        }
    }

    public InputStream getObject(String objectKey, long offset, long length) {
        try {
            return minioClient.getObject(GetObjectArgs.builder()
                                                      .bucket(minioProperties.getBucket())
                                                      .object(objectKey)
                                                      .offset(offset)
                                                      .length(length)
                                                      .build());
        } catch (Exception e) {
            throw new RuntimeException("Failed to get object", e);
        }
    }
}
