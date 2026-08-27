package com.learning.lab.fakeDatabase;

import com.learning.lab.model.User;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Repository
public class FakeUserRepository {
    private final ConcurrentHashMap<Long, User> store = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public FakeUserRepository() {
        // Add some dummy data
        User admin = User.builder()
                .id(idGenerator.getAndIncrement())
                .username("admin")
                .email("admin@example.com")
                .password("encoded_password") // In a real app this would be BCrypt
                .role("ADMIN")
                .createdAt(LocalDateTime.now())
                .build();
        store.put(admin.getId(), admin);
    }

    public User save(User user) {
        if (user.getId() == null) {
            user.setId(idGenerator.getAndIncrement());
            user.setCreatedAt(LocalDateTime.now());
        }
        store.put(user.getId(), user);
        return user;
    }

    public Optional<User> findById(Long id) {
        return Optional.ofNullable(store.get(id));
    }

    public Optional<User> findByEmail(String email) {
        return store.values().stream()
                .filter(u -> u.getEmail().equals(email))
                .findFirst();
    }

    public Optional<User> findByUsername(String username) {
        return store.values().stream()
                .filter(u -> u.getUsername().equals(username))
                .findFirst();
    }

    public void deleteById(Long id) {
        store.remove(id);
    }

    public List<User> findAll(int page, int size, String sortBy) {
        List<User> users = new ArrayList<>(store.values());
        
        if ("username".equalsIgnoreCase(sortBy)) {
            users.sort(Comparator.comparing(User::getUsername));
        } else {
            users.sort(Comparator.comparing(User::getId));
        }
        
        return users.stream()
                .skip((long) page * size)
                .limit(size)
                .collect(Collectors.toList());
    }

    public boolean existsByEmail(String email) {
        return store.values().stream().anyMatch(u -> u.getEmail().equals(email));
    }
}
