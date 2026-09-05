package nl.rabobank.casesummary.model;

/**
 * Prioriteit van een klantzaak.
 *
 * De frontend gebruikt de kleine-letter variant (low, medium, high, critical)
 * en zet deze om in api.js.
 */
public enum CasePriority {
    LOW,
    MEDIUM,
    HIGH,
    CRITICAL
}
