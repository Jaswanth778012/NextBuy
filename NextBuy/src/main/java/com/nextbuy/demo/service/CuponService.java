package com.nextbuy.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.nextbuy.demo.dto.CuponRequestDto;
import com.nextbuy.demo.entity.Cart;
import com.nextbuy.demo.entity.Cupon;
import com.nextbuy.demo.entity.User;
import com.nextbuy.demo.enums.CuponStatus;
import com.nextbuy.demo.repository.CartRepository;
import com.nextbuy.demo.repository.CuponRepository;
import com.nextbuy.demo.repository.UserCuponRepository;
import com.nextbuy.demo.repository.UserRepository;

@Service
public class CuponService {
	
	private  CartRepository cartRepository;
	
	private UserRepository userRepository;
	
	private CuponRepository cuponRepository;
	
	private UserCuponRepository userCouponRepository;
	
	public CuponService(CartRepository cartRepository, UserRepository userRepository, CuponRepository cuponRepository, UserCuponRepository userCouponRepository) {
		this.cartRepository = cartRepository;
		this.userRepository = userRepository;
		this.cuponRepository = cuponRepository;
		this.userCouponRepository = userCouponRepository;
	}
	
	public String createCupon(CuponRequestDto cuponRequest)
	{
		if(cuponRepository.findByCode(cuponRequest.getCode().toUpperCase()).isPresent())
		{
			throw new RuntimeException("Cupon code already exists");
		}
		
		if(cuponRequest.getDiscountPercentage() <= 0 ||cuponRequest.getDiscountPercentage() > 100)
		{
			throw new RuntimeException("Invalid discount percentage");
		}
		Cupon cupon = new Cupon();
		
		cupon.setDescription(cuponRequest.getDescription());
		
		cupon.setCode(cuponRequest.getCode().toUpperCase());
		
		cupon.setDiscountPercentage(cuponRequest.getDiscountPercentage());
		
		cupon.setCuponStatus(CuponStatus.INACTIVE);
		
		cupon.setUsageCount(0);
		
		cupon.setExpiryDate(cuponRequest.getExpiryDate());
		
		cupon.setMinimumAmount(cuponRequest.getMinimumAmount());
		
		cuponRepository.save(cupon);
		
		return "Cupon created successfully";
	}
	
	public String applyCoupon(String username, String Code)
	{
		
		User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
		
		Cart cart = cartRepository.findByUserAndActiveTrue(user).orElseThrow(() -> new RuntimeException("Active cart not found for user"));
		
		Cupon cupon = cuponRepository.findByCode(Code.toUpperCase()).orElseThrow(() -> new RuntimeException("Cupon code not found"));
		
		if(cart.getAppliedCupon() != null)
	    {
	        throw new RuntimeException("Coupon already applied");
	    }

		if(cupon.getCuponStatus() != CuponStatus.ACTIVE)
		{
			throw new RuntimeException("Cupon is not active");
		}
		
		if(cupon.getExpiryDate().isBefore(LocalDateTime.now()))
		{
		    cupon.setCuponStatus(CuponStatus.EXPIRED);
		    cuponRepository.save(cupon);

		    throw new RuntimeException("Coupon is expired");
		}
		
		if(cart.getTotalPrice() < cupon.getMinimumAmount())
		{
			throw new RuntimeException("Minimun Amount is not reached");
		}
		
		double discount =  cupon.getDiscountPercentage();
		
		double maxDiscount = cart.getTotalPrice()* discount/100;
		
		cart.setCuponDiscount(discount);
		
		if (userCouponRepository.existsByUserAndCupon(user, cupon)) {
		    throw new RuntimeException("Coupon already used by this user");
		}
		cart.setAppliedCupon(cupon);
		
		double finalPrice = cart.getTotalPrice() - maxDiscount + cart.getShipingCharges();
		
		if(finalPrice < 0)
		{
		    finalPrice = 0;
		}
		
		cart.setDiscount(0.0);
		
		cart.setFinalPrice(finalPrice);
		
		cartRepository.save(cart);
		
		return "Cupon Applied Successfully";
	}
	
	public String updateCupon(Long id, CuponRequestDto requestDto)
	{
	    Cupon cupon = cuponRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("Cupon not found"));

	    if(requestDto.getExpiryDate().isBefore(LocalDateTime.now()))
	    {
	        throw new RuntimeException("Coupon has already expired");
	    }

	    if(requestDto.getDiscountPercentage() <= 0
	            || requestDto.getDiscountPercentage() > 100)
	    {
	        throw new RuntimeException("Invalid discount percentage");
	    }

	    cupon.setDescription(requestDto.getDescription());
	    cupon.setDiscountPercentage(requestDto.getDiscountPercentage());
	    cupon.setMinimumAmount(requestDto.getMinimumAmount());
	    cupon.setExpiryDate(requestDto.getExpiryDate());
	    cupon.setCuponStatus(requestDto.getCuponStatus());

	    cuponRepository.save(cupon);

	    return "Cupon updated successfully";
	}
	
	public String deleteCupon(Long id)
	{
	    Cupon cupon = cuponRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("Cupon not found"));

	    cuponRepository.delete(cupon);

	    return "Cupon deleted successfully";
	}
	
	public String removeCupon(String username)
	{
	    User user = userRepository.findByUsername(username)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    Cart cart = cartRepository.findByUserAndActiveTrue(user)
	            .orElseThrow(() -> new RuntimeException("Cart not found"));

	    cart.setCuponDiscount(0.0);
	    cart.setAppliedCupon(null);

	    cart.setFinalPrice(
	            cart.getShipingCharges()
	            + cart.getTotalPrice()
	            - cart.getTotalPrice() * cart.getDiscount() / 100
	    );

	    cartRepository.save(cart);

	    return "Removed Cupon Successfully";
	}
	
	public List<Cupon> getAllCupons()
	{
		 List<Cupon> cupons = cuponRepository.findAll();

		    boolean updated = false;

		    for (Cupon cupon : cupons)
		    {
		        if (cupon.getCuponStatus() != CuponStatus.EXPIRED
		                && cupon.getExpiryDate().isBefore(LocalDateTime.now()))
		        {
		            cupon.setCuponStatus(CuponStatus.EXPIRED);
		            updated = true;
		        }
		    }

		    if(updated)
		    {
		        cuponRepository.saveAll(cupons);
		    }
		    return cupons;
	}
	
	public List<Cupon> getAvailableCupons()
	{
		return cuponRepository
		        .findByCuponStatusAndExpiryDateAfter(
		                CuponStatus.ACTIVE,
		                LocalDateTime.now()
		        );
	}
	
	public List<Cupon> getAvailableCouponsForUser(String username)
	{
	    User user = userRepository.findByUsername(username)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    List<Cupon> allCoupons =
	            cuponRepository.findByCuponStatusAndExpiryDateAfter(
	            		CuponStatus.ACTIVE,
	                    LocalDateTime.now());

	    return allCoupons.stream()
	            .filter(coupon ->
	                    !userCouponRepository.existsByUserAndCupon(user, coupon))
	            .toList();
	}
}
