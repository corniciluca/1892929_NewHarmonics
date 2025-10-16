package it.uniroma1.user_service.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "follows")
@Data
@NoArgsConstructor
public class Follow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // the user who follows

    @ElementCollection
    private List<String> artistIds; // list of artist IDs they follow
}


// --- NOT NEEDED ---