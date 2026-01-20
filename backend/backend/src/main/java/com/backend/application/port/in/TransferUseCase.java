package com.backend.application.port.in;

import com.backend.application.dto.TransferCommand;

public interface TransferUseCase {
    void transfer(TransferCommand command);
}