FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

COPY beatflow-common /app/beatflow-common
COPY beatflow-playback /app/beatflow-playback

WORKDIR /app/beatflow-common
RUN chmod +x mvnw && ./mvnw clean install -DskipTests

WORKDIR /app/beatflow-playback
RUN chmod +x mvnw && ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /app/beatflow-playback/target/playback-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8183

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
