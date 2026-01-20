package com.backend.application.port.in;

import com.backend.domain.model.Investment;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface InvestmentUseCase {
    List<Investment> getPortfolio(UUID userId);
    Investment buy(UUID userId, String symbol, String name, BigDecimal quantity, BigDecimal price, String type);
    Investment sell(UUID userId, String symbol, BigDecimal quantity, BigDecimal price);
    void randomizePrices(UUID userId);
}
