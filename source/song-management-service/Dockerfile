# ========================
# Stage 1: Build (optional if you already built)
# ========================
FROM maven:3.9.11-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# ========================
# Stage 2: Run
# ========================
FROM eclipse-temurin:21-jdk
WORKDIR /app
RUN mkdir -p /app/music     # TEMPORARY SAVE LOCATION
COPY --from=build /app/target/song-management-service-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8082

ENTRYPOINT ["java", "-jar", "app.jar"]
