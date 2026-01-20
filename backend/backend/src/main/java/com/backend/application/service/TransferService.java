package com.backend.application.service;

import com.backend.application.dto.TransferCommand;
import com.backend.application.port.in.TransferUseCase;
import com.backend.application.port.out.AccountPort;
import com.backend.application.port.out.TransactionPort;
import com.backend.domain.model.Account;
import com.backend.domain.model.LedgerTransaction;
import com.backend.domain.model.TransactionLine;
import com.backend.domain.model.types.OperationType;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class TransferService implements TransferUseCase {
    private final AccountPort accountPort;
    private final TransactionPort transactionPort;

    public TransferService(AccountPort accountPort, TransactionPort transactionPort) {
        this.accountPort = accountPort;
        this.transactionPort = transactionPort;
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED) // Optimization for performance
    public void transfer(TransferCommand command) {
        if (transactionPort.existsByIdempotencyKey(command.idempotencyKey())) return;

        Account source = accountPort.loadAccount(command.sourceAccountId())
                .orElseThrow(() -> new IllegalArgumentException("Source account not found"));
        Account target = accountPort.loadAccount(command.targetAccountId())
                .orElseThrow(() -> new IllegalArgumentException("Target account not found"));

        LedgerTransaction transaction = LedgerTransaction.create(command.description(), command.idempotencyKey());
        transaction.addLine(source.getId(), command.amount(), OperationType.DEBIT);
        transaction.addLine(target.getId(), command.amount(), OperationType.CREDIT);
        transaction.validate();

        source.debit(command.amount());
        target.credit(command.amount());

        transactionPort.save(transaction);
        accountPort.updateAccount(source);
        accountPort.updateAccount(target);
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void reverseTransaction(UUID originTransactionId, String reason) {

        LedgerTransaction origin = transactionPort.findById(originTransactionId)
                .orElseThrow(() -> new EntityNotFoundException("Origin Transaction not found"));


        String reversalKey = "REV-" + origin.getIdempotencyKey();
        if (transactionPort.existsByIdempotencyKey(reversalKey)) return;

        LedgerTransaction reversal = LedgerTransaction.createReversal(
                "REVERSAL: " + origin.getDescription(),
                reversalKey,
                origin.getId(),
                Map.of("reversal_reason", reason, "reversal_at", LocalDateTime.now().toString())
        );

        origin.getLines().forEach(line -> {
            OperationType inverseType = (line.type() == OperationType.DEBIT)
                    ? OperationType.CREDIT
                    : OperationType.DEBIT;

            reversal.addLine(line.accountId(), line.amount(), inverseType);

            // Actualizar el saldo basándose en el nuevo tipo
            BigDecimal adjustment = (inverseType == OperationType.CREDIT) ? line.amount() : line.amount().negate();
            // Nota: updateAccountBalance debe ser capaz de sumar o restar
            accountPort.updateAccountBalance(line.accountId(), adjustment);
        });

        transactionPort.save(reversal);
    }
}
