# ETAP 1: Builder
FROM gradle:8-jdk21 AS builder
WORKDIR /app
COPY *.gradle* ./
COPY src ./src
RUN gradle bootJar --no-daemon -x test

# ETAP 2: Runner
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 9000
ENTRYPOINT ["java", "-jar", "app.jar"]
