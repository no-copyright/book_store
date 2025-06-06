package com.hau.product_service.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.util.ArrayList;
import java.util.List;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "products")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Product {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    Long id;
    String title;
    String author;
    String publisher;
    Integer publicationYear;
    Integer packageSize;
    Integer pageSize;
    String form;
    String thumbnail;
    Integer quantity;
    Integer discount;
    Integer price;
    Integer priority;
    @Column(columnDefinition = "LONGTEXT")
    String description;
    @Column(unique = true)
    String slug;
    Double discountPercent;

    @ManyToMany(fetch = FetchType.LAZY) // Use LAZY fetching
    @JoinTable(
            name = "product_category", // Name of the join table
            joinColumns = @JoinColumn(name = "product_id", referencedColumnName = "id"), // Column referring to Product's ID
            inverseJoinColumns = @JoinColumn(name = "category_id", referencedColumnName = "id") // Column referring to Category's ID
    )
    // Exclude from equals and hashCode/toString generated by Lombok @Data
    // to prevent infinite loops or StackOverflow errors in bidirectional relationships.
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<Category> categories = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "product")
    List<ProductImage> productImage = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Rate> rates;

    private Float averageRate;

    boolean active;
    @CreationTimestamp
    LocalDateTime createdAt;
    @CreationTimestamp
    LocalDateTime updatedAt;


}
