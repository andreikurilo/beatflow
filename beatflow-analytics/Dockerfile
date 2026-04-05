FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

COPY beatflow-common /app/beatflow-common
COPY beatflow-analytics /app/beatflow-analytics

WORKDIR /app/beatflow-common
RUN chmod +x mvnw && ./mvnw clean install -DskipTests

WORKDIR /app/beatflow-analytics
RUN chmod +x mvnw && ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /app/beatflow-analytics/target/*.jar app.jar

EXPOSE 8184

ENTRYPOINT ["java", "-jar", "/app/app.jar"]