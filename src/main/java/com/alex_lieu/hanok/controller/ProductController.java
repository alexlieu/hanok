package com.alex_lieu.hanok.controller;

import com.alex_lieu.hanok.dto.ProductListDto;
import com.alex_lieu.hanok.dto.ProductListMapper;
import com.alex_lieu.hanok.dto.ProductUpdateDto;
import com.alex_lieu.hanok.enums.Category;
import com.alex_lieu.hanok.model.Product;
import com.alex_lieu.hanok.service.ProductService;
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
                    value = "cat",
                    required = false
            ) Category category,
            @RequestParam(
                    value = "min",
                    required = false
            ) BigDecimal min,
            @RequestParam(
                    value = "max",
                    required = false
            ) BigDecimal max,
            @RequestParam(
                    value = "available",
                    required = false
            ) Boolean available,
            @RequestParam(
                    value = "sortBy",
                    defaultValue = "name"
            ) String sortBy,
            @RequestParam(
                    value = "sortDir",
                    defaultValue = "asc"
            ) String sortDir,
            @PageableDefault(size=25, sort="name") Pageable pageable){
            // NEED TO HANDLE EXCEPTION WHERE AN EMPTY LIST IS RETURNED FROM A VALID QUERY
            Comparator<ProductListDto> comparator = searchProductComparator(sortBy, sortDir);
            List<ProductListDto> productListDtos = productService.searchProducts(category, name, min, max, available)
                    .stream().map(ProductListMapper::toProductListDto).sorted(comparator).toList();
            return ResponseEntity.ok(productListDtos);
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
            case "cat" -> Comparator.comparing(ProductListDto::category);
            case "price" -> Comparator.comparing(ProductListDto::price);
            default -> throw new IllegalArgumentException("Invalid sortBy parameter: " + sortBy);
        };

        if (sortDir.equalsIgnoreCase("desc")) {
            comparator = comparator.reversed();
        }

        return comparator;
    }
}
