package com.nextbuy.demo.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.nextbuy.demo.entity.Review;
import com.nextbuy.demo.service.ReviewService;

@RestController
@RequestMapping("/Reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }


    @PostMapping(value = "/add", consumes = "multipart/form-data")
    public String addReview(
            @RequestParam Long productId,
            @RequestParam String comment,
            @RequestParam List<MultipartFile> images,
            Principal principal) {

        return reviewService.addReview(productId, principal.getName(), comment, images);
    }


    @PostMapping("/{id}/like")
    public String like(@PathVariable Long id, Principal principal) {
        return reviewService.reactToReview(id, principal.getName(), true);
    }


    @PostMapping("/{id}/dislike")
    public String dislike(@PathVariable Long id, Principal principal) {
        return reviewService.reactToReview(id, principal.getName(), false);
    }


    @GetMapping("/product/{productId}")
    public List<Review> getReviews(@PathVariable Long productId) {
        return reviewService.getReviewsByProduct(productId);
    }


    @GetMapping("/{id}/likes")
    public long likes(@PathVariable Long id) {
        return reviewService.getLikes(id);
    }

    @GetMapping("/{id}/dislikes")
    public long dislikes(@PathVariable Long id) {
        return reviewService.getDislikes(id);
    }
}
