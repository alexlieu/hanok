package com.alex_lieu.hanok.service;

import com.alex_lieu.hanok.enums.Category;
import com.alex_lieu.hanok.model.Product;
import com.alex_lieu.hanok.model.ProductVariant;
import com.alex_lieu.hanok.repository.ProductRepository;
import com.alex_lieu.hanok.repository.ProductVariantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
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
        return product.getActive() ? product : throwProductNotFoundException(id);
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
     * Expects ProductVariants to be in Product's variations list - use Product.attachVariant method.
     * @param product
     * @return Saved Product
     */
    @Transactional
    public Product createProduct(Product product) {
        try {
            if ( !product.getActive() ) throw new IllegalArgumentException("Cannot save product without active flag");
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

    // edit product will take an id and a product object
    // you will confirm existence of product with id and change the values using the product pbject

    @Transactional
    public ProductVariant addVariantToProduct(Long productId, ProductVariant variant) {
        Product product = getProductById(productId);
        variant.setProduct(product);
        try {
            return productVariantRepository.save(variant);
        } catch (DataAccessException e) {
            throw new RuntimeException("Error while adding variant to product: " + e.getMessage());
        }
    }

    @Transactional
    public void deleteProductWithVariants(long id) {
        Product product = getProductById(id);
        List<ProductVariant> variants = product.getVariations();
        productVariantRepository.deleteAll(variants);
        productRepository.delete(product);
    }

    @Transactional
    public void deleteVariant(long id) {}

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
