# 1️⃣ Java 17 런타임 이미지
FROM eclipse-temurin:17-jdk

# 2️⃣ 컨테이너 작업 디렉토리
WORKDIR /app

# 3️⃣ GitHub Actions에서 빌드된 JAR 복사
ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} app.jar

# 4️⃣ 기본 프로필 (prod)
ENV SPRING_PROFILES_ACTIVE=prod

# 5️⃣ 실행 명령
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
