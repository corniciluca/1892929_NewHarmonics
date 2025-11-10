FROM maven:3.9.11-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jdk-focal

WORKDIR /app

COPY --from=build /app/target/*.jar user_service.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "user_service.jar"]