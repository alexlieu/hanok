package com.alex_lieu.hanok.controller;

import com.alex_lieu.hanok.dto.CategoryWithCountDto;
import com.alex_lieu.hanok.dto.ProductUpdateRequestDto;
import com.alex_lieu.hanok.dto.ResponseProductDto;
import com.alex_lieu.hanok.entity.Product;
import com.alex_lieu.hanok.enums.Category;
import com.alex_lieu.hanok.enums.FilterPriceRange;
import com.alex_lieu.hanok.service.ProductService;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173/")
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<ResponseProductDto>> getProducts(
            @RequestParam(
                    value = "name",
                    required = false
            ) String name,
            @RequestParam(
                    value = "category",
                    required = false
            ) String categoryInput,
            @RequestParam(
                    value = "min",
                    required = false
            ) BigDecimal min,
            @RequestParam(
                    value = "price-range",
                    required = false
            )String priceRangeInput,
            @RequestParam(
                    value = "max",
                    required = false
            ) BigDecimal max,
            @RequestParam(
                    value = "available",
                    required = false
            ) Boolean available,
            @RequestParam(
                    value = "sort-by",
                    defaultValue = "name"
            ) String sortBy,
            @RequestParam(
                    value = "sort-dir",
                    defaultValue = "asc"
            ) String sortDir,
            @PageableDefault(size = 25, sort = "name") Pageable pageable) {
            // NEED TO HANDLE EXCEPTION WHERE AN EMPTY LIST IS RETURNED FROM A VALID QUERY
            Category category = Category.fromString(categoryInput);
            FilterPriceRange priceRange = FilterPriceRange.fromString(priceRangeInput);
            BigDecimal effectiveMin = priceRange != null ? priceRange.getMin() : min;
            BigDecimal effectiveMax = priceRange != null ? priceRange.getMax() : max;
        Comparator<ResponseProductDto> comparator = searchProductComparator(sortBy, sortDir);
        List<ResponseProductDto> responseProductsDto = productService.searchProducts(category, name, effectiveMin, effectiveMax, available)
                .stream().map(ResponseProductDto::fromProduct).sorted(comparator).toList();
        return ResponseEntity.ok(responseProductsDto);
    }

    @GetMapping({"/categories"})
    public ResponseEntity<List<CategoryWithCountDto>> getCategories() {
        return ResponseEntity.ok(productService.getCategoryCounts());
    }

    @GetMapping({"/by-slug/{product-name}"})
    public ResponseEntity<Product> getProductBySlug(@PathVariable("product-name") @NotBlank String slug) {
        if (slug.isBlank()) throw new IllegalArgumentException("Product name slug cannot be blank");
        return ResponseEntity.ok(productService.findBySlug(slug.replaceAll("-+"," ")));
    }

    @GetMapping({"/{id}"})
    public ResponseEntity<Product> getProduct(@PathVariable long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productService.createProduct(product));
    }

    @PatchMapping({"/{id}"})
    public ResponseEntity<Product> updateProduct(@PathVariable long id, @RequestBody ProductUpdateRequestDto productUpdateRequestDto) {
        return ResponseEntity.ok(productService.updateProduct(id, productUpdateRequestDto));
    }

    private Comparator<ResponseProductDto> searchProductComparator(String sortBy, String sortDir) {
        Comparator<ResponseProductDto> comparator = switch (sortBy.toLowerCase()) {
            case "name" -> Comparator.comparing(ResponseProductDto::name);
            case "category" -> Comparator.comparing(ResponseProductDto::category);
            case "price" -> Comparator.comparing(
                    dto -> dto.priceRange().min(),
                    Comparator.nullsLast(BigDecimal::compareTo)
            );
            case "newest" -> Comparator.comparingLong(ResponseProductDto::id).reversed();
            default -> throw new IllegalArgumentException("Invalid sortBy parameter: " + sortBy.toLowerCase());
        };

        if (sortDir.equalsIgnoreCase("desc")) {
            comparator = comparator.reversed();
        }

        return comparator;
    }
}
