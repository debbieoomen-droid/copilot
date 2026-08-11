package nl.rabobank.casesummary.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import nl.rabobank.casesummary.model.CaseCategory;
import nl.rabobank.casesummary.validation.ValidIban;

/**
 * DTO voor het aanmaken van een nieuwe klantzaak.
 */
public record CreateCaseRequest(
    @NotBlank String customerId,
    @NotBlank String customerName,
    @ValidIban String iban,
    @NotNull CaseCategory category,
    @NotBlank String subject,
    String description
) {}
