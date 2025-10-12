FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/*.jar apigateway.jar

EXPOSE 9000

ENTRYPOINT ["java", "-jar", "apigateway.jar"]