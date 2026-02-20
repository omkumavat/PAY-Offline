# Use Java 21
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /Backend1

COPY . .

RUN chmod +x mvnw

RUN ./mvnw clean package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/payment-system-0.0.1-SNAPSHOT.jar"]