package com.alex_lieu.hanok.repository;
import com.alex_lieu.hanok.enums.Category;
import com.alex_lieu.hanok.entity.Product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // This excludes any Products without Variants so it needs to be ensured that when a Product is made, a variant is made also.
    @Query("SELECT DISTINCT p FROM Product p JOIN p.variations v " +
            "WHERE (:category IS NULL OR p.category = :category) " +
            "AND (:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
            "AND (:minPrice IS NULL OR v.price >= :minPrice) " +
            "AND (:maxPrice IS NULL OR v.price <= :maxPrice) " +
            "AND (:available IS NULL OR v.available = :available)" +
            "AND p.active = :active"
    )
    List<Product> searchProducts(
            @Param("category") Category category,
            @Param("name") String name,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("available") Boolean available,
            @Param("active") Boolean isActive
    );

}