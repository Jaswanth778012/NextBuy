package com.nextbuy.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.nextbuy.demo.entity.Address;
import com.nextbuy.demo.entity.User;
import com.nextbuy.demo.enums.AddressType;
import com.nextbuy.demo.repository.AddressRepository;
import com.nextbuy.demo.repository.UserRepository;

@Service
public class AddressService {
	private AddressRepository addressRepo;
	
	private UserRepository userRepo;
	
	public AddressService(AddressRepository addressRepo, UserRepository userRepo)
	{
		this.addressRepo = addressRepo;
		this.userRepo = userRepo;
	}
	
	
	public Address createAddress(String username, Address address)
	{
		User user = userRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("User Not Found"));
		
		if(Boolean.TRUE.equals(address.getDefaultAddress()))
		{
			List<Address> addresses = addressRepo.findByUser(user);
			addresses.forEach(a -> a.setDefaultAddress(false));
			addressRepo.saveAll(addresses);
		}
		
		address.setUser(user);
		address.setAddressType(AddressType.HOME);
		return addressRepo.save(address);
	}
	
	public List<Address> getAddresses(String username)
	{
		User user = userRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("User Not Found"));
		
		return addressRepo.findByUser(user);
	}
	
	public Address getAddressById(String username, Long addressId)
	{
		User user = userRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("User Not Found"));
		
		return addressRepo.findByIdAndUser(addressId, user).orElseThrow(() -> new RuntimeException("Address Not Found"));
	}
	
	public Address updateAddress(String username, Long addressId, Address updateAddress)
	{
		Address address = getAddressById(username, addressId);
		
		address.setFullName(updateAddress.getFullName());
		address.setMobileNumber(updateAddress.getMobileNumber());
		address.setPincode(updateAddress.getPincode());
		address.setHouseNo(updateAddress.getHouseNo());
		address.setArea(updateAddress.getArea());
		address.setLandmark(updateAddress.getLandmark());
		address.setCity(updateAddress.getCity());
		address.setCountry(updateAddress.getCountry());
		address.setAddressType(updateAddress.getAddressType());
		
		return addressRepo.save(address);
	}
	
	public String deleteAddress(String username, Long addressId)
	{
		Address address = getAddressById(username, addressId);
		
		addressRepo.delete(address);
		
		return "Address Deleted SucessFully";
	}
	
	public String setDefaultAddress(String username, Long addressId)
	{
		User user = userRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("User Not Found"));
		
		List<Address> addresses = addressRepo.findByUser(user);
		
		addresses.forEach(a -> a.setDefaultAddress(false));
		
		Address selected = addresses.stream()
							.filter(a -> a.getId().equals(addressId))
							.findFirst()
							.orElseThrow(() -> new RuntimeException("Address Not Found"));
		
		selected.setDefaultAddress(true);
		
		addressRepo.saveAll(addresses);
		
		return "Default Address Set Successfull";
		
	}
}
