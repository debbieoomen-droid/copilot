package nl.rabobank.casesummary.dto;

import nl.rabobank.casesummary.model.CaseCategory;
import nl.rabobank.casesummary.model.CaseStatus;

import java.time.LocalDateTime;

/**
 * DTO voor klantzaak responses.
 * Bevat geen gevoelige klantgegevens (BSN, volledig IBAN).
 */
public record CaseSummaryDTO(
    String id,
    String customerId,
    String customerName,
    String maskedIban,
    CaseCategory category,
    CaseStatus status,
    String subject,
    String description,
    String assignedAgent,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    LocalDateTime resolvedAt
) {}
