FROM openjdk:17-jdk-alpine
WORKDIR /app
COPY target/BackEnd-0.0.1-SNAPSHOT.jar /app/application.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/application.jar"]
