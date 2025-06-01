FROM eclipse-temurin:21-jdk-jammy

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src

RUN mvn package -DskipTests

EXPOSE 8888

ENV SPRING_PROFILES_ACTIVE=prod

ENTRYPOINT ["java", "-jar", "target/api-gateway-0.0.1-SNAPSHOT.jar"]