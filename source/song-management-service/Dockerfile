# ========================
# Stage 1: Build the application using Maven
# ========================
FROM maven:3.9.1-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Build the project, creating the JAR file. Skip tests to speed up the build.
RUN mvn clean package -DskipTests

# ========================
# Stage 2: Create the final, secure runtime image
# ========================
FROM openjdk:17-slim

# Define arguments for a non-root user and group to avoid hardcoding
ARG USER_NAME=springuser
ARG GROUP_NAME=springgroup
ARG UID=1001
ARG GID=1001

# Create the group and user
RUN addgroup --system --gid ${GID} ${GROUP_NAME}
RUN adduser --system --uid ${UID} --gid ${GID} ${USER_NAME}

# Set the working directory
WORKDIR /app

# Create the directory for multipart uploads
RUN mkdir -p /app/music

# Change ownership of the entire directory to the non-root user.
# This is the crucial step that fixes the "Device or resource busy" error.
RUN chown -R ${USER_NAME}:${GROUP_NAME} /app

# Switch to the non-root user for enhanced security
USER ${USER_NAME}

# Copy the built JAR from the 'build' stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port the application runs on
EXPOSE 8082

# The command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]


