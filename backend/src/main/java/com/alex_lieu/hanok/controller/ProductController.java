package com.alex_lieu.hanok.controller;

import com.alex_lieu.hanok.dto.CategoryCountDto;
import com.alex_lieu.hanok.dto.ProductListDto;
import com.alex_lieu.hanok.dto.ProductUpdateDto;
import com.alex_lieu.hanok.enums.Category;
import com.alex_lieu.hanok.entity.Product;
import com.alex_lieu.hanok.enums.FilterPriceRange;
import com.alex_lieu.hanok.service.ProductService;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

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
    public ResponseEntity<List<ProductListDto>> getProducts(
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
            @PageableDefault(size=25, sort="name") Pageable pageable){
            // NEED TO HANDLE EXCEPTION WHERE AN EMPTY LIST IS RETURNED FROM A VALID QUERY
            Category category = Category.fromString(categoryInput);
            FilterPriceRange priceRange = FilterPriceRange.fromString(priceRangeInput);
            BigDecimal effectiveMin = priceRange != null ? priceRange.getMin() : min;
            BigDecimal effectiveMax = priceRange != null ? priceRange.getMax() : max;
            Comparator<ProductListDto> comparator = searchProductComparator(sortBy, sortDir);
            List<ProductListDto> productListDtos = productService.searchProducts(category, name, effectiveMin, effectiveMax, available)
                    .stream().map(ProductListDto::fromProduct).sorted(comparator).toList();
            return ResponseEntity.ok(productListDtos);
    }

    @GetMapping({"/categories"})
    public ResponseEntity<List<CategoryCountDto>> getCategories() {
        return ResponseEntity.ok(productService.getCategoryCounts());
    }

    @GetMapping({"/slug/{product-name}"})
    public ResponseEntity<Long> getIdBySlug(@PathVariable("product-name") @NotBlank String slug) {
        if (slug.isBlank()) throw new IllegalArgumentException("Product name slug cannot be blank");
        String formattedProductName = Arrays.stream(slug.trim().toLowerCase().split("-"))
                .filter(word -> !word.isBlank())
                .map(word ->
                    word.substring(0, 1).toUpperCase() +
                    word.substring(1))
                .collect(Collectors.joining(" "));
        return ResponseEntity.ok(productService.findIdByProductName(formattedProductName));
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
    public ResponseEntity<Product> updateProduct(@PathVariable long id, @RequestBody ProductUpdateDto productUpdateDto) {
        return ResponseEntity.ok(productService.updateProduct(id, productUpdateDto));
    }

    private Comparator<ProductListDto> searchProductComparator(String sortBy, String sortDir) {
        Comparator<ProductListDto> comparator = switch (sortBy.toLowerCase()) {
            case "name" -> Comparator.comparing(ProductListDto::name);
            case "category" -> Comparator.comparing(ProductListDto::category);
            case "price" -> Comparator.comparing(
                    dto -> dto.priceRange().min(),
                    Comparator.nullsLast(BigDecimal::compareTo)
            );
            case "newest" -> Comparator.comparingLong(ProductListDto::id).reversed();
            default -> throw new IllegalArgumentException("Invalid sortBy parameter: " + sortBy.toLowerCase());
        };

        if (sortDir.equalsIgnoreCase("desc")) {
            comparator = comparator.reversed();
        }

        return comparator;
    }
}
