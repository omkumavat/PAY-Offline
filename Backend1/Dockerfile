# -------- BUILD STAGE --------
FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /project

# Copy entire repo
COPY . .

# Go inside Backend1 folder
WORKDIR /project/Backend1

# Make mvnw executable
RUN chmod +x mvnw

# Build project
RUN ./mvnw clean package -DskipTests

# -------- RUNTIME STAGE --------
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# Copy jar from Backend1 target folder
COPY --from=build /project/Backend1/target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]