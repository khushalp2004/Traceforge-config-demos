package com.learning.lab.fakeDatabase;

import com.learning.lab.model.Product;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Repository
public class FakeProductRepository {
    private final ConcurrentHashMap<Long, Product> store = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public FakeProductRepository() {
        Product p1 = Product.builder()
                .id(idGenerator.getAndIncrement())
                .name("Spring Boot in Action")
                .description("Book about Spring Boot")
                .price(new BigDecimal("39.99"))
                .stockQuantity(100)
                .createdAt(LocalDateTime.now())
                .build();
        store.put(p1.getId(), p1);
    }

    public Product save(Product product) {
        if (product.getId() == null) {
            product.setId(idGenerator.getAndIncrement());
            product.setCreatedAt(LocalDateTime.now());
        }
        store.put(product.getId(), product);
        return product;
    }

    public Optional<Product> findById(Long id) {
        return Optional.ofNullable(store.get(id));
    }

    public void deleteById(Long id) {
        store.remove(id);
    }

    public List<Product> findAll(int page, int size) {
        return store.values().stream()
                .sorted(Comparator.comparing(Product::getId))
                .skip((long) page * size)
                .limit(size)
                .collect(Collectors.toList());
    }

    public List<Product> searchByName(String keyword) {
        return store.values().stream()
                .filter(p -> p.getName().toLowerCase().contains(keyword.toLowerCase()))
                .collect(Collectors.toList());
    }
}
