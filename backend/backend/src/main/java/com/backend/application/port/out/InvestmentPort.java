package com.backend.application.port.out;

import com.backend.domain.model.Investment;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InvestmentPort {
    Investment save(Investment investment);
    List<Investment> findByUserId(UUID userId);
    Optional<Investment> findByUserIdAndSymbol(UUID userId, String symbol);
    void delete(UUID id);
}
