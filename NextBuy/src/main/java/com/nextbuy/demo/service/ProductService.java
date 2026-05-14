package com.nextbuy.demo.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.nextbuy.demo.dto.ProductDTO;
import com.nextbuy.demo.entity.Product;
import com.nextbuy.demo.enums.AvailabilityStockStatus;
import com.nextbuy.demo.enums.ProductCondition;
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
	//ADDPRODUCT
	public String addProduct(ProductDTO Pdto, MultipartFile imageFile) {
		Product p = new Product();
		if(productRepo.existsByNameAndBrand(Pdto.getName(),Pdto.getBrand() )) {
			return "Product alredy existed !!!";
		}
		 
		
    	p.setName(Pdto.getName());
    	p.setDescription(Pdto.getDescription());
    	p.setCategory(Pdto.getCategory());
    	p.setPrice(Pdto.getPrice());
    	p.setDiscountPercentage(0.0);
    	p.setStockQuantity(Pdto.getStockQuantity());
    	if(p.getStockQuantity() <= 0) {
    		p.setStockStatus(AvailabilityStockStatus.OutOff_Stock);
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
		if(Pdto.getPrice() > 1000) {
			p.setDiscountPercentage(Pdto.getDiscountPercentage());
			double finale = Pdto.getPrice()-Pdto.getPrice()*Pdto.getDiscountPercentage().doubleValue()/100;
			finale = Double.parseDouble(
			       String.format("%.2f", finale)
			);

			p.setFinalPrice(finale);
			
		}
		
		productRepo.save(p);
		return "Product Added Successfully";
	}
	//UPDATEDIS-COUNT
	public String updateDisCount(Long id ,Double disCount) {
		 Product product = productRepo.findById(id).get();
		 product.setDiscountPercentage(disCount);
		 double finale =product.getPrice()-product.getPrice()*disCount/100;
		 finale = Double.parseDouble(
			       String.format("%.2f", finale)
			);
		 product.setFinalPrice(finale);
		 productRepo.save(product);
		 return "updated DiscountPercentage";
	}
	
  //DELETEPRODDUCT
	public String deleteproduct(String name, Long Brand_id) {
		  
		  Optional<Product> pr = productRepo.findByName(name);
		  if(pr.isEmpty()) {
			  return "Product not Found";
		  }
		  Product product = pr.get();
		  if(!product.getName().equals(name) && !product.getBrand().equals(Brand_id)) {
			 
			  return "something went Worng";
		  }
		 
		  productRepo.deleteById(product.getId());
		  return "Product Deleted Successfully!!";
		
	}
	//VIEW_ALL_PRODUCTS
	public List<Product> viewAllProducts() {
		 List<Product> allproducts = productRepo.findAll();
		 if(allproducts.isEmpty()) {
			 throw new RuntimeException("No products found");
		 }
		return allproducts.stream()
				   .filter(p->p.getProductStatus()==ProductStatus.Active)
				   .sorted()
				   .toList();
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
    	p.setPrice(product.getPrice());
    	p.setDiscountPercentage(product.getDiscountPercentage().doubleValue());
    	p.setStockQuantity(product.getStockQuantity());
    	if(p.getStockQuantity() <= 0) {
    		p.setStockStatus(AvailabilityStockStatus.OutOff_Stock);
    	}else if(p.getStockQuantity() >= 100) {
    		p.setStockStatus(AvailabilityStockStatus.AVAILABLE);
    	}else {
    		p.setStockStatus(AvailabilityStockStatus.LIMITED_STOCK);
    	}
    	
    	if(imageFile != null && !imageFile.isEmpty()) {
    		String imageUrl = cloudinaryService.uploadProductImage(imageFile);
    		p.setImageUrl(imageUrl);
    	}
    	
    	
    	if(product.getPrice() > 1000) {
    		p.setDiscountPercentage(product.getDiscountPercentage().doubleValue());
    		 double finale =product.getPrice()-product.getPrice()*p.getDiscountPercentage()/100;
    		 finale = Double.parseDouble(
    			       String.format("%.2f", finale)
    			);
    		 p.setFinalPrice(finale);
			
		}
		
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
	    		p.setStockStatus(AvailabilityStockStatus.OutOff_Stock);
	    	}else if(p.getStockQuantity() >= 50) {
	    		p.setStockStatus(AvailabilityStockStatus.AVAILABLE);
	    	}else {
	    		p.setStockStatus(AvailabilityStockStatus.LIMITED_STOCK);
	    	}

	    		
	    	
	    	
		  productRepo.save(p);
		  return "Stock Quantity Updated Successfully!!";
	}
	
	//SerachByCategory
	public  List<Product> searchCategory(String category) {
		return productRepo.findAll()
			   .stream()
			   .filter(p->p.getCategory().equalsIgnoreCase(category))
			   .distinct()
			   .sorted()
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
	
}
