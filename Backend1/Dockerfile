FROM eclipse-temurin:17-jdk-alpine

WORKDIR /Backend1
COPY . .

RUN ./mvnw clean package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/payment-system.jar"]