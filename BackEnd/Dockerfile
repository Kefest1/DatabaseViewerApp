# Use a base image with a compatible JDK version (Java 17 in this case)
FROM adoptopenjdk/openjdk17:alpine-jre

# Set the working directory inside the container
WORKDIR /app

# Copy the packaged JAR file from the host into the container
COPY target/BackEnd-0.0.1-SNAPSHOT.jar /app/BackEnd-0.0.1-SNAPSHOT.jar

# Expose the port that your Spring Boot application runs on (default is 8080)
EXPOSE 8080

# Command to run the Spring Boot application when the container starts
CMD ["java", "-jar", "BackEnd-0.0.1-SNAPSHOT.jar"]
