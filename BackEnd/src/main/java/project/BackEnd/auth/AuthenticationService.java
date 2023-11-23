package project.BackEnd.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import project.BackEnd.User.UserInfo;
import project.BackEnd.User.UserInfoRepository;
import project.BackEnd.config.JwtService;
import org.springframework.security.authentication.AuthenticationManager;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserInfoRepository repository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        var user = UserInfo.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .password_hash(passwordEncoder.encode(request.getPassword()))
                .build();
        repository.save(user);
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        System.out.println("---------------------------------");
        System.out.println(request.getEmail());
        System.out.println(request.getPassword());
        System.out.println("---------------------------------");

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = repository.findByEmail(request.getEmail());

        if (user == null)
            System.err.println("ERROR");

        var jwtToken = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }
}
