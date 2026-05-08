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
		
		Cupon cupon = new Cupon();
		
		cupon.setCode(cuponRequest.getCode().toUpperCase());
		
		cupon.setDiscountPercentage(cuponRequest.getDiscountPercentage());
		
		cupon.setActive(cuponRequest.isActive());
		
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
		
		double discount = cart.getDiscount()* cupon.getDiscountPercentage()/100;
		
		cart.setDiscount(discount);
		
		cart.setFinalPrice(cart.getTotalPrice() - discount + cart.getShipingCharges());
		
		cartRepository.save(cart);
		
		return "Cupon Applied Successfully";
	}
	
	
	public String removeCupon(String username)
	{
		User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
		
		Cart cart = cartRepository.findByUserAndActiveTrue(user).orElseThrow(() -> new RuntimeException("Cart not found"));
		
		cart.setDiscount(0.0);
		
		cart.setFinalPrice(cart.getTotalPrice() + cart.getShipingCharges());
		
		cartRepository.save(cart);
		
		return "Removed Cupon is Successfully";
	}
}
