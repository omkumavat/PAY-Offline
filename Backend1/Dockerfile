# -------- BUILD STAGE --------
FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /Backend1
COPY . .
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# -------- RUNTIME STAGE --------
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /Backend1

# Copy jar and rename to app.jar
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]