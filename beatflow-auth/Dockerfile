FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

COPY beatflow-common /app/beatflow-common
COPY beatflow-auth /app/beatflow-auth

WORKDIR /app/beatflow-common
RUN chmod +x mvnw && ./mvnw clean install -DskipTests

WORKDIR /app/beatflow-auth
RUN chmod +x mvnw && ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /app/beatflow-auth/target/*.jar app.jar

EXPOSE 8181

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
