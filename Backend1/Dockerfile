# -------- BUILD STAGE --------
FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copy everything from Backend1 folder
COPY . .

# Build the project
RUN mvn clean package -DskipTests

# -------- RUNTIME STAGE --------
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# Copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]