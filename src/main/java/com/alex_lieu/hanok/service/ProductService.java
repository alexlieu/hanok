package com.alex_lieu.hanok.service;

import com.alex_lieu.hanok.dto.ProductUpdateDto;
import com.alex_lieu.hanok.dto.VariantUpdateDto;
import com.alex_lieu.hanok.enums.Category;
import com.alex_lieu.hanok.model.Product;
import com.alex_lieu.hanok.model.ProductVariant;
import com.alex_lieu.hanok.repository.ProductRepository;
import com.alex_lieu.hanok.repository.ProductVariantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
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


    public ProductVariant getProductVariantById(long id) {
        ProductVariant variant = productVariantRepository.findById(id).orElseThrow(() -> new ProductExceptions.ProductNotFoundException(id));
        return variant.getActive() ? variant : throwProductVariantNotFoundException(id);
    }

    private ProductVariant throwProductVariantNotFoundException(long id) {
        throw new ProductExceptions.ProductVariantNotFoundException(id);
    }

    /**
     * Creates a Product entry in the db along with all its variants
     * Expects ProductVariants to be in Product's variations list - use Product.attachVariant method
     * If a variant is assigned to a Product, that will be overridden to use this.Product
     * Do not need to assign active to true, this is done automatically
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

        return productRepository.save(product);
    }

    @Transactional
    public void updateVariants(Product product, List<VariantUpdateDto> variantUpdateDtos) {
        // Create a map of existing variants using a composite key of size and flavour
        Map<VariantKey, ProductVariant> existingVariants = product.getVariations().stream()
                .collect(Collectors.toMap(
                        v -> new VariantKey(v.getSize(), v.getFlavour()),
                        Function.identity(),
                        (v1, v2) -> v1 // In case of duplicates, keep the first one (merge function)
                ));

        List<ProductVariant> updatedVariants = new ArrayList<>();

        for (VariantUpdateDto variantUpdateDto : variantUpdateDtos) {
            VariantKey key = new VariantKey(variantUpdateDto.size(), variantUpdateDto.flavour());
            ProductVariant variant = existingVariants.get(key);

            if (variant != null) {
                // Variant already exists, no need to update
                variant.setPrice(variantUpdateDto.price());
                updatedVariants.add(variant);
                existingVariants.remove(key);
            } else {
                // Create new variant
                ProductVariant newVariant = ProductVariant.builder().product(product)
                        .price(variantUpdateDto.price()).flavour(variantUpdateDto.flavour())
                        .size(variantUpdateDto.size()).build();
                updatedVariants.add(newVariant);
            }
        }

        // Remove variants not present in the update
        product.getVariations().clear();
        product.getVariations().addAll(updatedVariants);
    }

    private record VariantKey(ProductVariant.Size size, ProductVariant.Flavour flavour) {}

    // Setting the active state for product variants could be done in the update product method instead
    // If all variants are inactive do we want to make the parent product inactive?
    @Transactional
    public Product updateProductStatus(long id) {
        Product product = getProductById(id);
        boolean newStatus = !product.getActive();
        for (ProductVariant variant : product.getVariations()) variant.setActive(newStatus);
        product.setActive(newStatus);
        return productRepository.save(product);
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
