package com.nextbuy.demo.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FestivalBanner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String festivalName;
    private String title;
    private String subtitle;

    @Column(length = 1000)
    private String imageUrl;

    private String redirectUrl;

    @ElementCollection
    @CollectionTable(
        name = "festival_banner_categories",
        joinColumns = @JoinColumn(name = "banner_id")
    )
    @Column(name = "category_name")
    private List<String> categories;

    @ElementCollection
    @CollectionTable(
        name = "festival_banner_subcategories",
        joinColumns = @JoinColumn(name = "banner_id")
    )
    @Column(name = "subcategory_name")
    private List<String> subCategories;

    private LocalDate startDate;
    private LocalDate endDate;

    private Integer priority = 1;
    private Boolean active = true;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}