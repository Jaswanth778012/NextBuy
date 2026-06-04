package com.nextbuy.demo.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.nextbuy.demo.dto.ComparisionProductDto;
import com.nextbuy.demo.dto.ProductDTO;
import com.nextbuy.demo.dto.UserResponceDTO;
import com.nextbuy.demo.entity.Product;
import com.nextbuy.demo.enums.AvailabilityStockStatus;
import com.nextbuy.demo.enums.ProductStatus;
import com.nextbuy.demo.repository.BrandRepository;
import com.nextbuy.demo.repository.ProductRepository;

@Service
public class ProductService {
	
	ProductRepository  productRepo;
	BrandRepository brandRepo;
	CloudinaryService cloudinaryService;
	
	public ProductService(ProductRepository productRepo, BrandRepository brandRepo, CloudinaryService cloudinaryService) {
		super();
		this.productRepo = productRepo;
		this.brandRepo = brandRepo;
		this.cloudinaryService = cloudinaryService;
	}

	public String addProduct(ProductDTO Pdto, MultipartFile imageFile) {
		Product p = new Product();
		if(productRepo.existsByNameAndBrand(Pdto.getName(),Pdto.getBrand() )) {
			return "Product alredy existed !!!";
		}
		 
		
    	p.setName(Pdto.getName());
    	p.setDescription(Pdto.getDescription());
    	p.setCategory(Pdto.getCategory());
    	p.setSubCategory(Pdto.getSubCategory());
    	p.setMrp_price(Pdto.getMrp_price());
    	p.setDiscountPercentage(0.0);
    	p.setStockQuantity(Pdto.getStockQuantity());
    	if(p.getStockQuantity() <= 0) {
    		p.setStockStatus(AvailabilityStockStatus.OUT_OFF_STOCK);
    	}else if(p.getStockQuantity() >= 100) {
    		p.setStockStatus(AvailabilityStockStatus.AVAILABLE);
    	}else {
    		p.setStockStatus(AvailabilityStockStatus.LIMITED_STOCK);
    	}
    	p.setProductCondition(Pdto.getProductCondition());
    	if(imageFile != null && !imageFile.isEmpty()) {
			String imageUrl = cloudinaryService.uploadProductImage(imageFile);
			p.setImageUrl(imageUrl);
		}
    
    	p.setAverageRating(0.0);
    	p.setTotalRating(0.0);
    	p.setRatingsCount(0);
    	p.setProductStatus(Pdto.getProductStatus());
    	p.setCreatedAt(LocalDate.now());
    	p.setUpdatedAt(LocalDateTime.now());
    	p.setDeliveryTimeInDays(Pdto.getDeliveryTimeInDays());
    	p.setAttributes(Pdto.getAttributes());
		p.setBrand(Pdto.getBrand());
		
		double mrp = Pdto.getMrp_price();

		double discount =
		        Pdto.getDiscountPercentage();

		double gst =
		        Pdto.getGstPercentage();

		double taxablePrice =
		        mrp - (mrp * discount / 100);

		double finalPrice =
		        calculateFinalPrice(
		                mrp,
		                discount,
		                gst
		        );

		p.setDiscountPercentage(discount);

		p.setGstPercentage(gst);
 
		p.setTaxablePrice(
		        Double.parseDouble(
		                String.format("%.2f", taxablePrice)
		        )
		);

		p.setFinalPrice(finalPrice);
		
		productRepo.save(p);
		return "Product Added Successfully";
	}
	
	public String updateDisCount(Long id ,Double disCount) {
		 Product product = productRepo.findById(id).get();
		 product.setDiscountPercentage(disCount);
		 double finale =product.getMrp_price()-product.getMrp_price()*disCount/100;
		 finale = Double.parseDouble(
			       String.format("%.2f", finale)
			);
		 product.setFinalPrice(finale);
		 productRepo.save(product);
		 return "updated DiscountPercentage";
	}
	
  //DELETEPRODDUCT
	public String deleteProduct(Long productId) {

	    Optional<Product> pr = productRepo.findById(productId);

	    if (pr.isEmpty()) {
	        return "Product not found";
	    }

	    Product product = pr.get();

	    if (!product.getId().equals(productId)) {
	        return "Product ID does not match";
	    }

	    productRepo.deleteById(product.getId());

	    return "Product deleted successfully!";
	}
	
	//VIEW_ALL_PRODUCTS
	public List<UserResponceDTO> viewAllProducts(){
		
		 List<Product> pr = productRepo.findAll();
		 if(pr.isEmpty()) {
			 throw new RuntimeException("Username is required");
		 }
		return pr.stream().map(this::mapToResponseDto).toList();
		
	}
	//UPDATEPRODUCT
	public String updateProduct(Long id ,ProductDTO product, MultipartFile imageFile) {
		
		    Optional<Product> pr = productRepo.findById(id) ;
		    if(pr.isEmpty()) {
		    	return "Product not found";
		    }
		     Product p = pr.get();
		     
		p.setName(product.getName());
    	p.setDescription(product.getDescription());
    	p.setCategory(product.getCategory());
    	p.setMrp_price(product.getMrp_price());
    	p.setDiscountPercentage(product.getDiscountPercentage().doubleValue());
    	p.setStockQuantity(product.getStockQuantity());
    	if(p.getStockQuantity() <= 0) {
    		p.setStockStatus(AvailabilityStockStatus.OUT_OFF_STOCK);
    	}else if(p.getStockQuantity() >= 100) {
    		p.setStockStatus(AvailabilityStockStatus.AVAILABLE);
    	}else {
    		p.setStockStatus(AvailabilityStockStatus.LIMITED_STOCK);
    	}
    	
    	if(imageFile != null && !imageFile.isEmpty()) {
    		String imageUrl = cloudinaryService.uploadProductImage(imageFile);
    		p.setImageUrl(imageUrl);
    	}
    	
    	
    	double mrp = product.getMrp_price();

    	double discount =
    	        product.getDiscountPercentage();

    	double gst =
    	        product.getGstPercentage();

    	double taxablePrice =
    	        mrp - (mrp * discount / 100);

    	double finalPrice =
    	        calculateFinalPrice(
    	                mrp,
    	                discount,
    	                gst
    	        );

    	p.setDiscountPercentage(discount);

    	p.setGstPercentage(gst);

    	p.setTaxablePrice(
    	        Double.parseDouble(
    	                String.format("%.2f", taxablePrice)
    	        )
    	);
    	p.setSubCategory(product.getSubCategory());
    	p.setProductCondition(product.getProductCondition());

    	p.setFinalPrice(finalPrice);
		
    	p.setUpdatedAt(LocalDateTime.now());
    	p.setDeliveryTimeInDays(product.getDeliveryTimeInDays());
    	p.setAttributes(product.getAttributes());
		p.setBrand(product.getBrand());
		
		productRepo.save(p);
		return "Product Updated Successfully";
		
	}
	//UPDATE-PRODUCT-STOCKQANTITY
	public String updateProductStockQantity(Long id,int stock) {
		   Optional<Product> pr = productRepo.findById(id);
		  if(pr.isEmpty()) {
			  return "Product not Found";
		  }
		  Product p =pr.get();
		  p.setStockQuantity(stock);
		  if(p.getStockQuantity() <= 0) {
	    		p.setStockStatus(AvailabilityStockStatus.OUT_OFF_STOCK);
	    	}else if(p.getStockQuantity() >= 50) {
	    		p.setStockStatus(AvailabilityStockStatus.AVAILABLE);
	    	}else {
	    		p.setStockStatus(AvailabilityStockStatus.LIMITED_STOCK);
	    	}

		  productRepo.save(p);
		  return "Stock Quantity Updated Successfully!!";
	}
	
	public List<ComparisionProductDto> compareProducts(
	        List<String> keywords) {

	    List<Product> products = new ArrayList<>();

	    for(String keyword : keywords) {

	        List<Product> matchedProducts =
	                productRepo.searchProducts(keyword);

	        if(matchedProducts.isEmpty()) {
	            throw new RuntimeException(
	                    "No products found for: " + keyword
	            );
	        }

	        products.add(matchedProducts.get(0));
	    }

	    Set<String> categories = products.stream()
	            .map(p -> p.getCategory().getName())
	            .collect(Collectors.toSet());

	    if(categories.size() > 1) {
	        throw new RuntimeException(
	                "Products must belong to same category"
	        );
	    }
	    
	    Set<String> subCategories = products.stream()
	            .map(p -> p.getSubCategory().getName())
	            .collect(Collectors.toSet());

	    if(subCategories.size() > 1) {

	        throw new RuntimeException(
	                "Products must belong to same subcategory"
	        );
	    }

	    return products.stream().map(product -> {

	        ComparisionProductDto dto =
	                new ComparisionProductDto();

	        dto.setName(product.getName());
	        dto.setSlug(product.getSlug());
	        dto.setImageUrl(product.getImageUrl());
	        dto.setMrpPrice(product.getMrp_price());
	        dto.setFinalPrice(product.getFinalPrice());
	        dto.setAverageRating(product.getAverageRating());
	        dto.setCategory(product.getCategory());
	        dto.setSubCategory(product.getSubCategory());
	        dto.setBrand(product.getBrand());
	        dto.setAttributes(product.getAttributes());

	        return dto;

	    }).toList();
	}
	
	//SerachByCategory
	public  List<Product> searchCategory(String category) {
		return productRepo.findAll()
			   .stream()
			   .filter(p->p.getCategory().getName().equalsIgnoreCase(category))
			   .distinct()
			   .sorted((a,b) ->
		        a.getName().compareTo(b.getName()))
			   .toList();
		
			  
	}
	
	
	//updateProductStatus
	public String updateProductStatus(Long id,ProductStatus status) {
		  Optional<Product> p = productRepo.findById(id);
		  if(p.isEmpty()) {
			  return "Product not found";
		  }
		 Product pr = p.get();
		 pr.setProductStatus(status);
		 productRepo.save(pr);
		 return "Product Status Updated !! ";
	}
	
	//gst and final price calculation
	private Double calculateFinalPrice(
	        Double mrp,
	        Double discountPercentage,
	        Double gstPercentage) {

	    double discountedPrice =
	            mrp - (mrp * discountPercentage / 100);

	    double gstAmount =
	            discountedPrice * gstPercentage / 100;

	    double finalPrice =
	            discountedPrice + gstAmount;

	    return Double.parseDouble(
	            String.format("%.2f", finalPrice)
	    );
	}
	
	public UserResponceDTO mapToResponseDto(Product product) {
		UserResponceDTO userDto = new UserResponceDTO ();
			userDto.setId(product.getId());
		  userDto.setName(product.getName());
	        userDto.setDescription(product.getDescription());
	        userDto.setCategory(product.getCategory());
	        userDto.setSubCategory(product.getSubCategory());
	        userDto.setProductCondition(
	                product.getProductCondition()
	        );
	        userDto.setPrice(product.getMrp_price());
	        userDto.setDiscountPercentage(product.getDiscountPercentage());
	        userDto.setProductStatus(product.getProductStatus());
	        userDto.setImageUrl(product.getImageUrl());
	        userDto .setAttributes(product.getAttributes());
	        userDto.setAverageRating(product.getAverageRating());
	        userDto.setBrand(product.getBrand());
	        userDto.setDeliveryTimeInDays(product.getDeliveryTimeInDays());
	        userDto.setFinalPrice(product.getFinalPrice());
	        userDto.setMrp_price(product.getMrp_price());
	        userDto.setGstPercentage(product.getGstPercentage());
	        userDto.setStockQuantity(product.getStockQuantity());
	        userDto.setTaxablePrice(product.getTaxablePrice());
	        
	 
	        
	        return userDto;
	     
	      
	  }
}
