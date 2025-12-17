package kr.ac.ync.library.global.common.s3;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3Uploader {

    private final S3Client s3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${cloud.aws.cloudfront.url}")
    private String cloudfrontUrl;

    /** ✅ 업로드 */

    public String uploadBookImage(MultipartFile file) throws IOException {
        String key = "books/" + UUID.randomUUID() + "-" + safeName(file.getOriginalFilename());

        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(request, RequestBody.fromBytes(file.getBytes()));
        return cloudfrontUrl + "/" + key;
    }

    /** ✅ 기존 이미지 삭제 (URL 기준) */

    public void deleteByUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) return;

        String key = extractKey(imageUrl);
        if (key == null || key.isBlank()) return;

        s3Client.deleteObject(b -> b.bucket(bucket).key(key));
    }

    /** CloudFront/S3 URL → S3 key 추출 */

    private String extractKey(String url) {
        // 예: https://xxxx.cloudfront.net/books/uuid-file.jpg
        int idx = url.indexOf("/books/");
        if (idx != -1) {
            return url.substring(idx + 1); // 앞의 '/' 제거 → books/...
        }

        // fallback: 도메인 뒤 전체 경로 사용
        int scheme = url.indexOf("://");
        if (scheme == -1) return null;

        int firstSlash = url.indexOf('/', scheme + 3);
        if (firstSlash == -1) return null;

        return url.substring(firstSlash + 1);
    }

    private String safeName(String original) {
        if (original == null) return "file";
        return original.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}
