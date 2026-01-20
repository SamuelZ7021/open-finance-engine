package com.backend.application.service;

import com.backend.application.dto.AnalyticsResponse;
import com.backend.application.port.in.AnalyticsUseCase;
import com.backend.domain.model.types.OperationType;
import com.backend.infrastructure.adapter.out.persistence.entity.AccountEntity;
import com.backend.infrastructure.adapter.out.persistence.entity.TransactionEntity;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataAccountRepository;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService implements AnalyticsUseCase {

    private final SpringDataAccountRepository accountRepository;
    private final SpringDataTransactionRepository transactionRepository;

    @Override
    public List<AnalyticsResponse.BalanceHistoryPoint> getBalanceHistory(UUID userId) {
        // 1. Get all accounts for user
        List<AccountEntity> accounts = accountRepository.findByOwnerId(userId);
        List<UUID> accountIds = accounts.stream().map(AccountEntity::getId).collect(Collectors.toList());

        // 2. Get current total balance
        BigDecimal currentTotal = accounts.stream()
                .map(AccountEntity::getBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 3. Prepare result list (last 12 months)
        List<AnalyticsResponse.BalanceHistoryPoint> history = new ArrayList<>();
        LocalDate now = LocalDate.now();
        
        // Add current month (simplified: current balance is end of current month estimation)
        history.add(new AnalyticsResponse.BalanceHistoryPoint(
            now.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH), 
            currentTotal
        ));

        // 4. Backtrack
        // For accurate backtracking requires getting transactions for each month and subtracting/adding.
        // Simplified Logic: 
        // We will fetch transactions for LAST 11 months.
        
        LocalDate startOfLoop = now.minusMonths(11).withDayOfMonth(1); 
        
        // This is expensive if many transactions. Ideally use DB Aggregation.
        // But for MVP:
        
        List<TransactionEntity> allTransactions = new ArrayList<>();
        for (UUID accId : accountIds) {
             allTransactions.addAll(transactionRepository.findAllByAccountId(accId));
        }
        
        // Process backwards from previous month
        BigDecimal runningBalance = currentTotal;

        for (int i = 0; i < 11; i++) {
            YearMonth targetMonth = YearMonth.from(now.minusMonths(i)); // Current month (transactions already happened)
            // Wait, to get PREVIOUS month end balance, we need to REVERSE transactions of CURRENT month.
            
            // Logic: Balance_Prev_Month_End = Balance_Curr_Month_End - (Credits_Curr - Debits_Curr)
            
            BigDecimal monthlyNetFlow = calculateNetFlow(allTransactions, accountIds, targetMonth);
            runningBalance = runningBalance.subtract(monthlyNetFlow);
            
            YearMonth prevMonth = targetMonth.minusMonths(1);
            history.add(0, new AnalyticsResponse.BalanceHistoryPoint(
                prevMonth.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH),
                runningBalance
            ));
        }
        
        // Ensure strictly 12 points and order
        // The loop above adds to index 0, so it pushes them in reverse chronological order (correct for "history").
        // We added Current first at end (which is effectively index size-1).
        // Wait, list.add(0) adds to front.
        // initial: [Current]
        // i=0 (Current Month Net Flow): subtract flow -> Balance End of Prev Month. Add to 0.
        // [Prev1, Current]
        // ...
        
        return history; // Should be ordered Jan -> Dec
    }

    @Override
    public List<AnalyticsResponse.MonthlyFlow> getIncomeVsExpenses(UUID userId) {
        List<AccountEntity> accounts = accountRepository.findByOwnerId(userId);
        List<UUID> accountIds = accounts.stream().map(AccountEntity::getId).collect(Collectors.toList());

        List<AnalyticsResponse.MonthlyFlow> flows = new ArrayList<>();
        LocalDate now = LocalDate.now();

        List<TransactionEntity> allTransactions = new ArrayList<>();
        for (UUID accId : accountIds) {
             allTransactions.addAll(transactionRepository.findAllByAccountId(accId));
        }

        // Last 6 months
        for (int i = 5; i >= 0; i--) {
            YearMonth targetMonth = YearMonth.from(now.minusMonths(i));
            
            BigDecimal income = BigDecimal.ZERO;
            BigDecimal expenses = BigDecimal.ZERO;
            
            // Filter transactions for this month
            for (TransactionEntity tx : allTransactions) {
                YearMonth txMonth = YearMonth.from(tx.getTimestamp());
                if (txMonth.equals(targetMonth)) {
                    // Sum lines
                    for (var line : tx.getLines()) {
                        if (accountIds.contains(line.getAccountId())) {
                             if (line.getType() == OperationType.CREDIT) {
                                 income = income.add(line.getAmount());
                             } else {
                                 expenses = expenses.add(line.getAmount());
                             }
                        }
                    }
                }
            }
            
            flows.add(new AnalyticsResponse.MonthlyFlow(
                targetMonth.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH),
                income,
                expenses
            ));
        }
        return flows;
    }

    private BigDecimal calculateNetFlow(List<TransactionEntity> transactions, List<UUID> myAccountIds, YearMonth month) {
        BigDecimal net = BigDecimal.ZERO;
        for (TransactionEntity tx : transactions) {
            if (YearMonth.from(tx.getTimestamp()).equals(month)) {
                for (var line : tx.getLines()) {
                     if (myAccountIds.contains(line.getAccountId())) {
                         if (line.getType() == OperationType.CREDIT) {
                             net = net.add(line.getAmount());
                         } else {
                             net = net.subtract(line.getAmount());
                         }
                     }
                }
            }
        }
        return net;
    }
}
