package nl.rabobank.casesummary.service;

import nl.rabobank.casesummary.dto.CaseSummaryDTO;
import nl.rabobank.casesummary.dto.CreateCaseRequest;
import nl.rabobank.casesummary.model.CaseStatus;
import nl.rabobank.casesummary.model.CustomerCase;
import nl.rabobank.casesummary.repository.CaseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Service laag voor klantzaken operaties.
 * Alle business rules en validatie vinden hier plaats.
 */
@Service
public class CaseService {

    private static final Logger log = LoggerFactory.getLogger(CaseService.class);

    private final CaseRepository caseRepository;

    public CaseService(CaseRepository caseRepository) {
        this.caseRepository = caseRepository;
    }

    /**
     * Haal een gepagineerde lijst van zaken op.
     */
    public Page<CaseSummaryDTO> getCases(Pageable pageable) {
        return caseRepository.findAll(pageable).map(this::toDTO);
    }

    /**
     * Haal een enkele zaak op basis van ID.
     */
    public CaseSummaryDTO getCaseById(String caseId) {
        CustomerCase customerCase = caseRepository.findById(caseId)
            .orElseThrow(() -> new CaseNotFoundException(caseId));
        return toDTO(customerCase);
    }

    /**
     * Maak een nieuwe klantzaak aan.
     */
    public CaseSummaryDTO createCase(CreateCaseRequest request) {
        CustomerCase newCase = new CustomerCase(
            request.customerId(),
            request.customerName(),
            request.category(),
            request.subject()
        );
        newCase.setIban(request.iban());
        newCase.setDescription(request.description());

        CustomerCase saved = caseRepository.save(newCase);
        log.info("Nieuwe zaak aangemaakt: id={}, categorie={}", saved.getId(), saved.getCategory());
        return toDTO(saved);
    }

    /**
     * Wijzig de status van een zaak.
     * Bevat business rules:
     * - Gesloten zaken kunnen niet heropend worden
     * - Opgelost zaken krijgen een resolvedAt timestamp
     */
    public CaseSummaryDTO updateStatus(String caseId, CaseStatus newStatus) {
        CustomerCase customerCase = caseRepository.findById(caseId)
            .orElseThrow(() -> new CaseNotFoundException(caseId));

        if (customerCase.getStatus() == CaseStatus.CLOSED) {
            throw new IllegalStateException("Gesloten zaken kunnen niet worden gewijzigd");
        }

        if (newStatus == CaseStatus.RESOLVED) {
            customerCase.setResolvedAt(LocalDateTime.now());
        }

        customerCase.setStatus(newStatus);
        customerCase.setUpdatedAt(LocalDateTime.now());
        CustomerCase saved = caseRepository.save(customerCase);

        log.info("Zaak {} status gewijzigd naar {}", caseId, newStatus);
        return toDTO(saved);
    }

    // ── Private helpers ──────────────────────────────────────────────────────

    private CaseSummaryDTO toDTO(CustomerCase c) {
        return new CaseSummaryDTO(
            c.getId(),
            c.getCustomerId(),
            c.getCustomerName(),
            maskIban(c.getIban()),
            c.getCategory(),
            c.getStatus(),
            c.getSubject(),
            c.getDescription(),
            c.getAssignedAgent(),
            c.getCreatedAt(),
            c.getUpdatedAt(),
            c.getResolvedAt()
        );
    }

    /**
     * Maskeert een IBAN voor weergave: NL12 RABO **** **** 89
     */
    private String maskIban(String iban) {
        if (iban == null || iban.length() < 8) return "****";
        return iban.substring(0, 8) + " **** **** " + iban.substring(iban.length() - 2);
    }
}
