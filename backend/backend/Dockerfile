# Stage 1: Build stage
FROM eclipse-temurin:17-jdk-alpine AS builder

# Set working directory
WORKDIR /app

# Copy maven wrapper and pom.xml first to leverage Docker cache
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline -B

# Copy source code and build
COPY src ./src
RUN ./mvnw package -DskipTests

# Stage 2: Runtime stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Create a non-root user for security (Under the hood best practice)
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy only the built jar from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# JVM Performance Tuning for Containers
# - UseContainerSupport: Auto-adjust heap based on container limits
# - XX:MaxRAMPercentage: Better than hardcoding -Xmx
ENTRYPOINT ["java", \
            "-XX:+UseContainerSupport", \
            "-XX:MaxRAMPercentage=75.0", \
            "-Djava.security.egd=file:/dev/./urandom", \
            "-jar", \
            "app.jar"]
