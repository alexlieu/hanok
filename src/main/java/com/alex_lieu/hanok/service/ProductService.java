package com.alex_lieu.hanok.service;

import com.alex_lieu.hanok.dto.ProductUpdateDto;
import com.alex_lieu.hanok.dto.VariantUpdateDto;
import com.alex_lieu.hanok.enums.Category;
import com.alex_lieu.hanok.entity.Product;
import com.alex_lieu.hanok.entity.ProductVariant;
import com.alex_lieu.hanok.repository.ProductRepository;
import com.alex_lieu.hanok.repository.ProductVariantRepository;
import jakarta.persistence.PersistenceException;
import jakarta.validation.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;

    @Autowired
    public ProductService(ProductRepository productRepository, ProductVariantRepository productVariantRepository) {
        this.productRepository = productRepository;
        this.productVariantRepository = productVariantRepository;
    }

    public List<Product> findAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(long id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new ProductExceptions.ProductNotFoundException(id));
//        return product.getActive() ? product : throwProductNotFoundException(id);
        return product;
    }

    private Product throwProductNotFoundException(Long id) {
        throw new ProductExceptions.ProductNotFoundException(id);
    }


    public ProductVariant getActiveProductVariantById(long id) {
        ProductVariant variant = productVariantRepository.findById(id).orElseThrow(() -> new ProductExceptions.ProductNotFoundException(id));
        return variant.getActive() ? variant : throwProductVariantNotFoundException(id);
    }

    private ProductVariant throwProductVariantNotFoundException(long id) {
        throw new ProductExceptions.ProductVariantNotFoundException(id);
    }

    /**
     * Creates a Product entry in the db along with all its variants
     * Expects ProductVariants to be in Product's variations list - use Product.attachVariant method
     * To update variants you need to parse all fields and all variants e.g. if you don't list a variant in your update, it will be deleted
     * @param product
     * @return Saved Product
     */
    @Transactional
    public Product createProduct(Product product) {
        try {
            if (!product.getActive()) throw new IllegalArgumentException("Cannot save product without active flag set as false");
            List<ProductVariant> variants = product.getVariations();
            if (variants.isEmpty()) {
                product.createDefaultProduct();
            } else {
                for (ProductVariant variant : variants) variant.setProduct(product);
            }
            return productRepository.save(product);
        } catch (DataAccessException e) {
            throw new RuntimeException("Error while saving product: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid product data: " + e.getMessage());
        }
    }

    @Transactional
    public Product updateProduct(long id, ProductUpdateDto updateDto) {
        Product product = getProductById(id);

        if (updateDto.name() != null) product.setName(updateDto.name());
        if (updateDto.description() != null) product.setDescription(updateDto.description());
        if (updateDto.category() != null) product.setCategory(updateDto.category());
        if (updateDto.basePrice() != null) product.setBasePrice(updateDto.basePrice());
        if (updateDto.imageUrl() != null) product.setImageUrl(updateDto.imageUrl());
        if (updateDto.variants() != null) updateVariants(product, updateDto.variants());
        if (updateDto.active() != null) product.setActive(updateDto.active());

        if (product.getActive()) {
            boolean hasActiveVariant = product.getVariations().stream().anyMatch(ProductVariant::getActive);
            if (!hasActiveVariant) {
                throw new IllegalStateException("Product cannot be active without at least one active variant.");
            }
        }

        try {
            return productRepository.save(product);
        } catch (DataIntegrityViolationException ex) {
           throw new IllegalStateException("Database integrity violation: " + ex.getMessage(), ex);
        } catch (ConstraintViolationException ex) {
            throw new IllegalStateException("Constraint violation occured: " + ex.getMessage(), ex);
        } catch (PersistenceException ex) {
            Throwable cause = ex.getCause();
            if (cause != null && cause.getMessage().contains("unique")) {
                throw new IllegalStateException("Duplicate entry detected", ex);
            }
            throw new IllegalStateException("An unexpected persistence error occurred", ex);
        }
    }

    public void updateVariants(Product product, List<VariantUpdateDto> variantUpdateDtos) {
        // Create a map of existing variants using a composite key of size and flavour
        Map<VariantKey, ProductVariant> existingVariants = product.getVariations().stream()
                .collect(Collectors.toMap(
                        v -> new VariantKey(v.getSize(), v.getFlavour()),
                        Function.identity(),
                        (v1, v2) -> v1 // In case of duplicates, keep the first one (merge function)
                ));

        Set<VariantKey> processedVariants = new HashSet<>();

        for (VariantUpdateDto variantUpdateDto : variantUpdateDtos) {
            if (variantUpdateDto.size() == null || variantUpdateDto.flavour() == null) {
                throw new IllegalArgumentException
                        ("Product Variants cannot be updated or created with null values for flavour and size.");
            };
            VariantKey key = new VariantKey(variantUpdateDto.size(), variantUpdateDto.flavour());
            ProductVariant variant = existingVariants.get(key);

            if (variant != null) {
                // Update existing variant
                updateVariantFromDto(variant, variantUpdateDto);
            } else {
                // Create new variant
                ProductVariant newVariant = createVariantFromDto(product, variantUpdateDto);
                product.getVariations().add(newVariant);
            }
            processedVariants.add(key);
        }

        // Soft delete variants that are not present in the update.
        for (ProductVariant variant : product.getVariations()) {
            VariantKey key = new VariantKey(variant.getSize(), variant.getFlavour());
            if (!processedVariants.contains(key)) {
                variant.setActive(false);
            }
        }
    }

    private record VariantKey(ProductVariant.Size size, ProductVariant.Flavour flavour) {}

    private void updateVariantFromDto(ProductVariant variant, VariantUpdateDto dto) {
        // Use current Product Variant value if no value is given for a field
        if (dto.price() != null) variant.setPrice(dto.price());
        if (dto.active() != null) variant.setActive(dto.active());
        if (dto.available() != null) variant.setAvailable(dto.available());
    }

    private ProductVariant createVariantFromDto(Product product, VariantUpdateDto dto) {
        if (dto.price() == null) throw new IllegalArgumentException("Price is required when creating a new product variant.");
        return ProductVariant.builder()
                .product(product)
                .price(dto.price())
                .flavour(dto.flavour())
                .size(dto.size())
                .active(dto.active() != null ? dto.active() : true)
                .available(dto.available() != null ? dto.available() : true)
                .build();
    }

    public List<ProductVariant> getVariantsForProduct(long productId) {
        try {
            return productVariantRepository.findByProductId(productId);
        } catch (DataAccessException e) {
            throw new RuntimeException("Error while getting variants for product: " + e.getMessage());
        }
    }

    public List<Product> searchProducts(Category category, String name,
                                        BigDecimal minPrice, BigDecimal maxPrice,
                                        Boolean available) {
        return productRepository.searchProducts(category, name, minPrice, maxPrice, available, true);
    }

}
