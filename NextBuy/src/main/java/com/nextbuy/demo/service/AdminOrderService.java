package com.nextbuy.demo.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nextbuy.demo.entity.Order;
import com.nextbuy.demo.enums.OrderStatus;
import com.nextbuy.demo.repository.OrderItemRepository;
import com.nextbuy.demo.repository.OrderRepository;

@Service
@Transactional
public class AdminOrderService {

    private OrderRepository orderRepo;
    private OrderItemRepository orderItemsRepo;

    public AdminOrderService(OrderRepository orderRepo,
                             OrderItemRepository orderItemsRepo) {

        this.orderRepo = orderRepo;
        this.orderItemsRepo = orderItemsRepo;
    }

    public List<Order> getAllOrders() {
        return orderRepo.findAll();
    }

    public Order getOrderById(Long id) {

        return orderRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Order Id not found"));
    }

    public String updateOrderStatus(Long id, OrderStatus status) {

        Order order = orderRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Order Id not found"));

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException(
                    "Cancelled order status cannot be changed");
        }

        if (order.getStatus() == OrderStatus.RETURNED) {
            throw new RuntimeException(
                    "Returned order status cannot be changed");
        }

        order.setStatus(status);

        if (status == OrderStatus.DELIVERED) {

            if (order.getDeliveredAt() == null) {
                order.setDeliveredAt(LocalDateTime.now());
            }
        }

        if (status == OrderStatus.CANCELLED) {
            order.setCancelledAt(LocalDateTime.now());
        }

        orderRepo.save(order);

        return "Order status updated successfully";
    }

    public List<Order> getUserOrders(Long userId) {

        List<Order> orders = orderRepo.findByUserId(userId);

        if (orders.isEmpty()) {
            throw new RuntimeException("No orders found for this user");
        }

        return orders;
    }

    public List<Order> getOrdersByDate(LocalDate date) {

        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.atTime(LocalTime.MAX);

        return orderRepo.findByOrderedAtBetween(start, end);
    }

    public List<Order> todayOrders(LocalDate today) {


        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.atTime(LocalTime.MAX);

        return orderRepo.findByOrderedAtBetween(start, end);
    }

    public List<Order> getByStatus(OrderStatus status) {

        return orderRepo.findByStatus(status);
    }

    public Double totalSales() {

        return orderRepo.findAll()
                .stream()
                .filter(order ->
                        order.getStatus() == OrderStatus.DELIVERED)
                .mapToDouble(Order::getFinalPrice)
                .sum();
    }

    public int countOfAllOrders() {

        return orderRepo.findAll().size();
    }

    public long deliveredOrdersCount() {

        return orderRepo.findAll()
                .stream()
                .filter(order ->
                        order.getStatus() == OrderStatus.DELIVERED)
                .count();
    }

    public long cancelledOrdersCount() {

        return orderRepo.findAll()
                .stream()
                .filter(order ->
                        order.getStatus() == OrderStatus.CANCELLED)
                .count();
    }

    public long returnedOrdersCount() {

        return orderRepo.findAll()
                .stream()
                .filter(order ->
                        order.getStatus() == OrderStatus.RETURNED)
                .count();
    }
}