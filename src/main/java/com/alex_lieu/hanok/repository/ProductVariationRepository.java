package com.alex_lieu.hanok.repository;

import com.alex_lieu.hanok.model.Product;
import com.alex_lieu.hanok.model.ProductVariation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface ProductVariationRepository extends JpaRepository<ProductVariation, Long> {
    Page<ProductVariation> findByProductId(Long id, Pageable pageable);
    Page<ProductVariation> findByFlavour(ProductVariation.Flavour flavour, Pageable pageable);
    Page<ProductVariation> findBySize(ProductVariation.Size size, Pageable pageable);
    Page<ProductVariation> findByPriceBetween(BigDecimal min, BigDecimal max, Pageable pageable);
    Page<ProductVariation> findByAvailableTrue(Pageable pageable);
}