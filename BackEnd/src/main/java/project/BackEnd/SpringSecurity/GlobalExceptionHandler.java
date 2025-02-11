package project.BackEnd.SpringSecurity;

import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<String> handleExpiredJwtException(ExpiredJwtException ex) {
        System.err.println("JWT expired: " + ex.getMessage());

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("JWT token has expired. Please log in again.");
    }

}