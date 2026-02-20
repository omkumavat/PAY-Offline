# -------- BUILD STAGE --------
FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /app
COPY . .
RUN chmod +x Backend1/mvnw
WORKDIR /app/Backend1
RUN ./mvnw clean package -DskipTests

# -------- RUNTIME STAGE --------
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# 🔥 Correct jar path
COPY --from=build /app/Backend1/target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]