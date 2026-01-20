package com.backend.application.service;

import com.backend.application.port.in.AccountUseCase;
import com.backend.application.port.in.InvestmentUseCase;
import com.backend.application.port.out.InvestmentPort;
import com.backend.domain.model.Account;
import com.backend.domain.model.Investment;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class InvestmentService implements InvestmentUseCase {

    private final InvestmentPort investmentPort;
    
    // TODO: Integrate with AccountService for balance updates (Withdrawal/Deposit use cases).
    // Currently focusing on investment logic implementation.
    
    @Override
    public List<Investment> getPortfolio(UUID userId) {
        return investmentPort.findByUserId(userId);
    }

    @Override
    @Transactional
    public Investment buy(UUID userId, String symbol, String name, BigDecimal quantity, BigDecimal price, String type) {
        // TODO: Deduct balance from User's account.
        
        Optional<Investment> existing = investmentPort.findByUserIdAndSymbol(userId, symbol);

        if (existing.isPresent()) {
            Investment inv = existing.get();
            BigDecimal totalCost = inv.getAveragePrice().multiply(inv.getQuantity());
            BigDecimal newCost = price.multiply(quantity);
            BigDecimal totalQty = inv.getQuantity().add(quantity);
            
            BigDecimal newAvg = totalCost.add(newCost).divide(totalQty, 4, RoundingMode.HALF_UP);
            
            inv.setQuantity(totalQty);
            inv.setAveragePrice(newAvg);
            inv.setCurrentPrice(price); // Update to latest market price
            inv.setLastUpdated(LocalDateTime.now());
            return investmentPort.save(inv);
        } else {
            Investment newInv = Investment.builder()
                    .id(UUID.randomUUID())
                    .userId(userId)
                    .symbol(symbol)
                    .name(name)
                    .quantity(quantity)
                    .averagePrice(price)
                    .currentPrice(price)
                    .type(type)
                    .lastUpdated(LocalDateTime.now())
                    .build();
            return investmentPort.save(newInv);
        }
    }

    @Override
    @Transactional
    public Investment sell(UUID userId, String symbol, BigDecimal quantity, BigDecimal price) {
        // TODO: Add balance to User's account.
        
        Investment inv = investmentPort.findByUserIdAndSymbol(userId, symbol)
                .orElseThrow(() -> new RuntimeException("Investment not found"));

        if (inv.getQuantity().compareTo(quantity) < 0) {
            throw new RuntimeException("Insufficient quantity");
        }

        BigDecimal newQty = inv.getQuantity().subtract(quantity);
        
        if (newQty.compareTo(BigDecimal.ZERO) == 0) {
            investmentPort.delete(inv.getId());
            return inv; // Return last state
        } else {
            inv.setQuantity(newQty);
            inv.setLastUpdated(LocalDateTime.now());
            inv.setCurrentPrice(price);
            return investmentPort.save(inv);
        }
    }

    @Scheduled(fixedRate = 5000) // Every 5 seconds
    public void simulateMarketUpdates() {
        // Placeholder for global market updates
    }
    
    @Override
    public void randomizePrices(UUID userId) {
         List<Investment> portfolio = investmentPort.findByUserId(userId);
         portfolio.forEach(inv -> {
             double changePlugin = ThreadLocalRandom.current().nextDouble(0.98, 1.02); // +/- 2%
             BigDecimal newPrice = inv.getCurrentPrice().multiply(BigDecimal.valueOf(changePlugin));
             inv.setCurrentPrice(newPrice);
             investmentPort.save(inv);
         });
    }
}
