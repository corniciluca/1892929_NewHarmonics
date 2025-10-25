package it.uniroma1.user_service.controller;


import it.uniroma1.user_service.dto.LoginRequest;
import it.uniroma1.user_service.dto.LoginResponse;
import it.uniroma1.user_service.dto.RegisterRequest;
import it.uniroma1.user_service.enums.Role;
import it.uniroma1.user_service.model.UserEntity;
import it.uniroma1.user_service.util.JwtUtil;
import it.uniroma1.user_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // Validate user doesn't exist
        if (userService.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        // Validate role
        if (!request.getRole().equals("ARTIST") && !request.getRole().equals("LISTENER")) {
            return ResponseEntity.badRequest().body("Invalid role. Must be ARTIST or LISTENER");
        }

        // Create user
        UserEntity user = new UserEntity();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setRole(Role.valueOf(request.getRole()));
        
        
        UserEntity savedUser = userService.save(user);
        
        // Generate token
        String token = jwtUtil.generateToken(
            savedUser.getUsername(),
            savedUser.getId().toString(),
            savedUser.getRole().toString()
        );

        return ResponseEntity.ok(new LoginResponse(token, savedUser.getUsername(), savedUser.getRole().toString()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        UserEntity user = userService.findUserByUsername(request.getUsername());
        
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        String token = jwtUtil.generateToken(
            user.getUsername(),
            user.getId().toString(),
            user.getRole().toString()
        );

        return ResponseEntity.ok(new LoginResponse(token, user.getUsername(), user.getRole().toString()));
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader(value = "Authorization", required = false) String authHeader) {

        // Check if Authorization header is present and starts with "Bearer "
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            // Validate token (signature and expiration)
            if (jwtUtil.validateToken(token) && !jwtUtil.isTokenExpired(token)) {
                // SUCCESS: Token is valid
                return ResponseEntity.ok().body(Map.of(
                        "valid", true,
                        "username", jwtUtil.extractUsername(token),
                        "userId", jwtUtil.extractUserId(token),
                        "role", jwtUtil.extractRole(token)
                ));
            }
        }

        return ResponseEntity.ok().body(Map.of("valid", false));
    }
}