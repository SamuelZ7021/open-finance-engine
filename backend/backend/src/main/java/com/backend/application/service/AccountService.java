package com.backend.application.service;

import com.backend.application.dto.AccountResponse;
import com.backend.application.dto.AccountTransactionResponse;
import com.backend.application.port.in.AccountUseCase;
import com.backend.application.port.out.AccountPort;
import com.backend.application.port.out.TransactionPort;
import com.backend.domain.exception.AccountAccessDeniedException;
import com.backend.domain.model.Account;
import com.backend.domain.model.LedgerTransaction;
import com.backend.domain.model.TransactionLine;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccountService implements AccountUseCase {

    private final AccountPort accountPort;
    private final TransactionPort transactionPort;

    @Override
    public List<Account> getAccountsByOwner(UUID ownerId) {
        return accountPort.findByOwnerId(ownerId);
    }

    @Override
    public List<AccountResponse> getAccountsForUser(UUID userId) {
        return accountPort.findByOwnerId(userId).stream()
                .map(acc -> {
                    List<AccountTransactionResponse> transactions = transactionPort.findByAccountId(acc.getId())
                            .stream()
                            .map(tx -> mapToAccountTransaction(tx, acc.getId()))
                            .toList();

                    return new AccountResponse(
                            acc.getId(),
                            acc.getAccountNumber(),
                            acc.getType(),
                            acc.getBalance(),
                            acc.isActive(),
                            transactions
                    );
                }).toList();
    }

    @Override
    public void verifyAccountOwnership(UUID userId, UUID accountId) {
        Account account = accountPort.loadAccount(accountId)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        // Verificamos que el ownerId de la cuenta coincida con el usuario autenticado
        if (!account.getOwnerId().equals(userId)) {
            throw new AccountAccessDeniedException("Access Denied: You are not the owner of this account");
        }
    }

    @Override
    public AccountResponse getAccountDetails(UUID accountId) {
        Account acc = accountPort.loadAccount(accountId)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        List<AccountTransactionResponse> transactions = transactionPort.findByAccountId(acc.getId())
                .stream()
                .map(tx -> mapToAccountTransaction(tx, acc.getId()))
                .toList();

        return new AccountResponse(
                acc.getId(),
                acc.getAccountNumber(),
                acc.getType(),
                acc.getBalance(),
                acc.isActive(),
                transactions
        );
    }

    @Override
    public Account getAccountByNumber(String accountNumber) {
        return accountPort.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new IllegalArgumentException("Account with number " + accountNumber + " not found"));
    }

    private AccountTransactionResponse mapToAccountTransaction(LedgerTransaction tx, UUID accountId) {
        TransactionLine line = tx.getLines().stream()
                .filter(l -> l.accountId().equals(accountId))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Transaction line not found for account " + accountId));

        return new AccountTransactionResponse(
                tx.getId(),
                tx.getTimestamp(),
                tx.getDescription(),
                line.amount(),
                line.type()
        );
    }
}
