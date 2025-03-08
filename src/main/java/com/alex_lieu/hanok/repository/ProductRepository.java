package com.alex_lieu.hanok.repository;
import com.alex_lieu.hanok.model.Product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.awt.print.Pageable;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(Product.Category category, Pageable pageable);
    List<Product> findByCategoryAndAvailableTrue(Product.Category category, Pageable pageable);
    List<Product> findByNameContaining(String name, Pageable pageable);
    List<Product> findByAvailableTrue(Pageable pageable);
    List<Product> findByNameContainingAndAvailableTrue(String name, Pageable pageable);
    List<Product> findByNameContainingAndAvailableTrueAndCategory(String name, Product.Category category, Pageable pageable);
    List<Product> findByNameContainingAndCategory(String name, Product.Category category, Pageable pageable);
}