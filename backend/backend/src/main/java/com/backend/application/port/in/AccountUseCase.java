package com.backend.application.port.in;

import com.backend.application.dto.AccountResponse;
import com.backend.domain.model.Account;

import java.util.List;
import java.util.UUID;

public interface AccountUseCase {
    List<Account> getAccountsByOwner(UUID ownerId);
    List<AccountResponse> getAccountsForUser(UUID userId);
    void verifyAccountOwnership(UUID userId, UUID accountId);
    AccountResponse getAccountDetails(UUID accountId);
    Account getAccountByNumber(String accountNumber);
}
