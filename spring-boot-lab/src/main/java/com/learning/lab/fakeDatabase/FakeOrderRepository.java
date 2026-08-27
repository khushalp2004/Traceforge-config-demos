package com.learning.lab.fakeDatabase;

import com.learning.lab.model.Order;
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
public class FakeOrderRepository {
    private final ConcurrentHashMap<Long, Order> store = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public Order save(Order order) {
        if (order.getId() == null) {
            order.setId(idGenerator.getAndIncrement());
            order.setOrderDate(LocalDateTime.now());
            if (order.getStatus() == null) {
                order.setStatus("PENDING");
            }
        }
        store.put(order.getId(), order);
        return order;
    }

    public Optional<Order> findById(Long id) {
        return Optional.ofNullable(store.get(id));
    }

    public void deleteById(Long id) {
        store.remove(id);
    }

    public List<Order> findAllByUserId(Long userId) {
        return store.values().stream()
                .filter(o -> o.getUserId().equals(userId))
                .sorted(Comparator.comparing(Order::getOrderDate).reversed())
                .collect(Collectors.toList());
    }

    public List<Order> findAll(int page, int size) {
        return store.values().stream()
                .sorted(Comparator.comparing(Order::getId).reversed())
                .skip((long) page * size)
                .limit(size)
                .collect(Collectors.toList());
    }
}
