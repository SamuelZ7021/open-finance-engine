package com.backend.infrastructure.adapter.in.web;

import com.backend.application.dto.AnalyticsResponse;
import com.backend.application.port.in.AnalyticsUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.backend.infrastructure.adapter.out.persistence.entity.UserEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsUseCase analyticsUseCase;

    private UUID getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserEntity user = (UserEntity) auth.getPrincipal();
        return user.getId();
    }

    @GetMapping("/balance-history")
    public ResponseEntity<List<AnalyticsResponse.BalanceHistoryPoint>> getBalanceHistory() {
        return ResponseEntity.ok(analyticsUseCase.getBalanceHistory(getCurrentUserId()));
    }

    @GetMapping("/income-vs-expenses")
    public ResponseEntity<List<AnalyticsResponse.MonthlyFlow>> getIncomeVsExpenses() {
        return ResponseEntity.ok(analyticsUseCase.getIncomeVsExpenses(getCurrentUserId()));
    }
}
