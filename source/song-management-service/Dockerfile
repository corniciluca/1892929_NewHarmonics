# Stage 1: Build the application using Maven
FROM maven:3.9.1-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create the final, secure runtime image
FROM eclipse-temurin:17-jre-focal

ARG USER_NAME=springuser
ARG GROUP_NAME=springgroup
ARG UID=1001
ARG GID=1001

RUN addgroup --system --gid ${GID} ${GROUP_NAME}
RUN adduser --system --uid ${UID} --gid ${GID} ${USER_NAME}

WORKDIR /app

RUN mkdir -p /app/music

RUN chown -R ${USER_NAME}:${GROUP_NAME} /app

USER ${USER_NAME}

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8082

ENTRYPOINT ["java", "-jar", "app.jar"]


