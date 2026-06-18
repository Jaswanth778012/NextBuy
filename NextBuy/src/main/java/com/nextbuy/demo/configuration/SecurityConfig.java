package com.nextbuy.demo.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.client.RestTemplate;

import com.nextbuy.demo.filter.JwtAuthenticationFilter;
import com.nextbuy.demo.service.CustomUserDetailsService;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService customUserDetailsService;
	

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                          CustomUserDetailsService customUserDetailsService) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.customUserDetailsService = customUserDetailsService;
    }

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationProvider authenticationProvider)
			throws Exception {

		http
		.cors(cors -> {})
		.csrf(csrf -> csrf.disable())
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(auth -> auth

						.requestMatchers("/auth/**","/festival-banner/**").permitAll()
						.requestMatchers(
							    "/festival-banner/getActive"
							).permitAll()

						
						.requestMatchers("/Product/viewAllProducts").permitAll()
				.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
				.requestMatchers("/Brands/**","/Categories/**","/Subcategories/**").permitAll()
						.requestMatchers("/Admin/**","/Product/**","/Brands/**","/Cupon/**","/Payments/refund/**","/adminOrder/**","/Categories/**","/Subcategories/**","/AdminStats/**").hasRole("ADMIN")
		            .requestMatchers("/User/**", "/Rating/**", "/Reviews/**","/Cupon/apply/**","/Cupon/remove/**","/SaveForLater/**","/Wishlist/**","/Cart/**","/Orders/**","/Payments/verify/**","/Address/**","/wishlist-alerts/**").hasRole("USER")
	            
	            	.requestMatchers("/Common/**").hasAnyRole("USER","ADMIN")
	            
						.anyRequest().authenticated())
				.authenticationProvider(authenticationProvider)
				.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
				.formLogin(form -> form.disable())
				.httpBasic(httpBasic -> httpBasic.disable());

		return http.build();
	}

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(customUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
    
}