# ========================
# Stage 1: Build
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

# Optional folder for logs or temp files
RUN mkdir -p /app/logs

# Copy the built JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port your Spring Boot app runs on
EXPOSE 8083

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
