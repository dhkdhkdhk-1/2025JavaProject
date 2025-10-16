package kr.ac.ync.library.global.common.web;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import java.util.List;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "cors")
public class CorsProperties {
    // ✅ 기본값을 넣어 null 방지
    private List<String> allowedOrigins = List.of("http://localhost:3000");
}