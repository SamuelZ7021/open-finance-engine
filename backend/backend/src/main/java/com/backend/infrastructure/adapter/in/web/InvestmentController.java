package com.backend.infrastructure.adapter.in.web;

import com.backend.application.dto.InvestmentRequest;
import com.backend.application.port.in.InvestmentUseCase;
import com.backend.domain.model.Investment;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.backend.infrastructure.adapter.out.persistence.entity.UserEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/investments")
@RequiredArgsConstructor
public class InvestmentController {

    private final InvestmentUseCase investmentUseCase;

    private UUID getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserEntity user = (UserEntity) auth.getPrincipal();
        return user.getId();
    }

    @GetMapping
    public ResponseEntity<List<Investment>> getPortfolio() {
        UUID userId = getCurrentUserId();
        // Simulate real-time updates on fetch
        investmentUseCase.randomizePrices(userId);
        return ResponseEntity.ok(investmentUseCase.getPortfolio(userId));
    }

    @PostMapping("/buy")
    public ResponseEntity<Investment> buy(@RequestBody InvestmentRequest request) {
        UUID userId = getCurrentUserId();
        return ResponseEntity.ok(investmentUseCase.buy(
                userId, 
                request.getSymbol(), 
                request.getName(), 
                request.getQuantity(), 
                request.getPrice(),
                request.getType()
        ));
    }

    @PostMapping("/sell")
    public ResponseEntity<Investment> sell(@RequestBody InvestmentRequest request) {
        UUID userId = getCurrentUserId();
        return ResponseEntity.ok(investmentUseCase.sell(
                userId, 
                request.getSymbol(), 
                request.getQuantity(), 
                request.getPrice()
        ));
    }
}
