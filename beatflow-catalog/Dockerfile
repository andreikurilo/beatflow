FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

COPY beatflow-common /app/beatflow-common
COPY beatflow-catalog /app/beatflow-catalog

WORKDIR /app/beatflow-common
RUN chmod +x mvnw && ./mvnw clean install -DskipTests

WORKDIR /app/beatflow-catalog
RUN chmod +x mvnw && ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /app/beatflow-catalog/target/*.jar app.jar

EXPOSE 8182

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
