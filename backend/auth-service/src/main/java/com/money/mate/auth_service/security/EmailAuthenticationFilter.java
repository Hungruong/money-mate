package com.money.mate.auth_service.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class EmailAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    public EmailAuthenticationFilter(AuthenticationManager authenticationManager) {
        super(authenticationManager);
        setFilterProcessesUrl("/login"); // Set the URL this filter should intercept
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) {
        String email = obtainUsername(request);
        String password = obtainPassword(request);

        if (email == null) {
            email = "";
        }
        if (password == null) {
            password = "";
        }

        email = email.trim();

        EmailAuthenticationToken authRequest = new EmailAuthenticationToken(email, password);

        return this.getAuthenticationManager().authenticate(authRequest);
    }
}