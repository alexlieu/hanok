package com.alex_lieu.hanok.repository;

import com.alex_lieu.hanok.model.ProductVariant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    Page<ProductVariant> findByProductId(Long id, Pageable pageable);
    Page<ProductVariant> findByFlavour(ProductVariant.Flavour flavour, Pageable pageable);
    Page<ProductVariant> findBySize(ProductVariant.Size size, Pageable pageable);
    Page<ProductVariant> findByPriceBetween(BigDecimal min, BigDecimal max, Pageable pageable);
    Page<ProductVariant> findByAvailableTrue(Pageable pageable);
}