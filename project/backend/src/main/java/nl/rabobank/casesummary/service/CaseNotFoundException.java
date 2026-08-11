package nl.rabobank.casesummary.service;

/**
 * Gegooid wanneer een zaak niet gevonden wordt.
 */
public class CaseNotFoundException extends RuntimeException {
    public CaseNotFoundException(String caseId) {
        super("Zaak niet gevonden: " + caseId);
    }
}
