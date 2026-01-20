package com.backend.application.port.in;

import com.backend.application.dto.AnalyticsResponse;
import java.util.List;
import java.util.UUID;

public interface AnalyticsUseCase {
    List<AnalyticsResponse.BalanceHistoryPoint> getBalanceHistory(UUID userId);
    List<AnalyticsResponse.MonthlyFlow> getIncomeVsExpenses(UUID userId);
}
