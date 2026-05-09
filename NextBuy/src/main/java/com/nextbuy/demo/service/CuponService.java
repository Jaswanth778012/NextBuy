package com.nextbuy.demo.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.nextbuy.demo.dto.CuponRequestDto;
import com.nextbuy.demo.entity.Cart;
import com.nextbuy.demo.entity.Cupon;
import com.nextbuy.demo.entity.User;
import com.nextbuy.demo.repository.CartRepository;
import com.nextbuy.demo.repository.CuponRepository;
import com.nextbuy.demo.repository.UserRepository;

@Service
public class CuponService {
	
	private  CartRepository cartRepository;
	
	private UserRepository userRepository;
	
	private CuponRepository cuponRepository;
	
	public CuponService(CartRepository cartRepository, UserRepository userRepository, CuponRepository cuponRepository) {
		this.cartRepository = cartRepository;
		this.userRepository = userRepository;
		this.cuponRepository = cuponRepository;
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
		
		cupon.setCode(cuponRequest.getCode().toUpperCase());
		
		cupon.setDiscountPercentage(cuponRequest.getDiscountPercentage());
		
		cupon.setActive(false);
		
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

		if(!cupon.isActive())
		{
			throw new RuntimeException("Cupon is not active");
		}
		
		if(cupon.getExpiryDate().isBefore(LocalDateTime.now()))
		{
			throw new RuntimeException("Cupon is Expired");
		}
		
		if(cart.getTotalPrice() < cupon.getMinimumAmount())
		{
			throw new RuntimeException("Minimun Amount is not reached");
		}
		
		double discount =  cupon.getDiscountPercentage();
		
		double maxDiscount = cart.getTotalPrice()* discount/100;
		
		cart.setCuponDiscount(discount);
		
		cart.setAppliedCupon(cupon);
		
		double finalPrice = cart.getTotalPrice() - maxDiscount + cart.getShipingCharges();
		
		if(finalPrice < 0)
		{
		    finalPrice = 0;
		}
		
		cart.setFinalPrice(finalPrice);
		
		cartRepository.save(cart);
		
		return "Cupon Applied Successfully";
	}
	
	public String updateCupon(String code, CuponRequestDto requestDto)
	{
	    Cupon cupon = cuponRepository.findByCode(code.toUpperCase())
	            .orElseThrow(() -> new RuntimeException("Cupon not found"));
	    
	    if(requestDto.getExpiryDate().isBefore(LocalDateTime.now()))
	    {
	        throw new RuntimeException("Invalid expiry date");
	    }
	    
	    if(requestDto.getDiscountPercentage() <= 0 ||requestDto.getDiscountPercentage() > 100)
		{
			throw new RuntimeException("Invalid discount percentage");
		}

	    cupon.setDiscountPercentage(requestDto.getDiscountPercentage());

	    cupon.setMinimumAmount(requestDto.getMinimumAmount());

	    cupon.setExpiryDate(requestDto.getExpiryDate());

	    cupon.setActive(requestDto.isActive());

	    cuponRepository.save(cupon);

	    return "Cupon updated successfully";
	}
	
	public String removeCupon(String username)
	{
		User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
		
		Cart cart = cartRepository.findByUserAndActiveTrue(user).orElseThrow(() -> new RuntimeException("Cart not found"));
		
		cart.setCuponDiscount(0.0);
		
		cart.setAppliedCupon(null);
		
		cart.setFinalPrice(  cart.getShipingCharges()+cart.getTotalPrice() - cart.getTotalPrice()*cart.getDiscount()/100);
		
		cartRepository.save(cart);
		
		return "Removed Cupon is Successfully";
	}
}
