package com.nextbuy.demo.service;


import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String uploadFile(MultipartFile file) {
        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                        "folder", "profile_pictures"   
                    )
            );

            return uploadResult.get("secure_url").toString();

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image to Cloudinary", e);
        }
    }
    
    public String uploadBrandLogo(MultipartFile file) {
    	try {
    		Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("folder", "logo_pictures"));
    		
    		return uploadResult.get("secure_url").toString();
    	}
    	catch(IOException e) {
    		throw new RuntimeException("Failed to upload brand logo to Cloudinary", e);
    	}
    }
    
    public String uploadProductImage(MultipartFile file) {
		try {
			Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("folder", "product_pictures"));
			
			return uploadResult.get("secure_url").toString();
		}
		catch(IOException e) {
			throw new RuntimeException("Failed to upload product image to Cloudinary", e);
		}
	}

    
    public void deleteFile(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete image from Cloudinary", e);
        }
    }
    
    public String uploadImage(MultipartFile file) {
        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.emptyMap()
            );
            return uploadResult.get("secure_url").toString();

        } catch (IOException e) {
            throw new RuntimeException("Image upload failed");
        }
    }
    
    public List<String> uploadImagesReview(List<MultipartFile> files) {

        return files.stream()
                .map(this::uploadImage)
                .toList();
    }
    
    public String uploadDpUrl(MultipartFile file) {
    	try {
    		Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("folder", "profile_pictures"));
    		
    		return uploadResult.get("secure_url").toString();
    	}
    	catch(IOException e) {
    		throw new RuntimeException("Failed to upload brand logo to Cloudinary", e);
    	}
    }
}
