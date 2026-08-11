package nl.rabobank.casesummary.model;

/**
 * Status van een klantzaak.
 */
public enum CaseStatus {
    OPEN,
    IN_PROGRESS,
    WAITING_CUSTOMER,
    ESCALATED,
    RESOLVED,
    CLOSED
}
