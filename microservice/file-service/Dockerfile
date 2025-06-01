# === Giai đoạn 1: Build native executable ===
FROM ghcr.io/graalvm/graalvm-community:jdk-21 AS builder

WORKDIR /app


COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src


RUN mvn -Pnative native:compile-no-fork -DskipTests

# === Giai đoạn 2: Tạo image runtime nhỏ gọn ===
FROM gcr.io/distroless/cc-debian11

WORKDIR /app


COPY --from=builder /app/target/file-service .

EXPOSE 8087

ENV SPRING_PROFILES_ACTIVE=prod

ENTRYPOINT ["./file-service"]