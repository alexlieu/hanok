package com.alex_lieu.hanok.repository;
import com.alex_lieu.hanok.model.Product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByCategory(Product.Category category, Pageable pageable);
    Page<Product> findByCategoryAndAvailableTrue(Product.Category category, Pageable pageable);
    Page<Product> findByNameContaining(String name, Pageable pageable);
    Page<Product> findByAvailableTrue(Pageable pageable);
    Page<Product> findByNameContainingAndAvailableTrue(String name, Pageable pageable);
    Page<Product> findByNameContainingAndAvailableTrueAndCategory(String name, Product.Category category, Pageable pageable);
    Page<Product> findByNameContainingAndCategory(String name, Product.Category category, Pageable pageable);
}