package nl.rabobank.casesummary.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import nl.rabobank.casesummary.dto.CaseSummaryDTO;
import nl.rabobank.casesummary.dto.CreateCaseRequest;
import nl.rabobank.casesummary.model.CaseStatus;
import nl.rabobank.casesummary.model.CaseSummary;
import nl.rabobank.casesummary.repository.CaseSummaryRepository;
import nl.rabobank.casesummary.service.CaseService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * REST controller voor klantzaken.
 * Volgt Rabobank API conventies:
 * - Versioned paths (/api/v1/...)
 * - ResponseEntity return types
 * - @Valid voor input validatie
 */
@RestController
@RequestMapping("/api/v1/cases")
public class CaseController {

    private final CaseService caseService;
    private final CaseSummaryRepository caseSummaryRepository;

    public CaseController(CaseService caseService, CaseSummaryRepository caseSummaryRepository) {
        this.caseService = caseService;
        this.caseSummaryRepository = caseSummaryRepository;
    }

    @GetMapping
    public ResponseEntity<Page<CaseSummaryDTO>> getCases(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(caseService.getCases(pageRequest));
    }

    @GetMapping("/{caseId}")
    public ResponseEntity<CaseSummaryDTO> getCase(@PathVariable String caseId) {
        return ResponseEntity.ok(caseService.getCaseById(caseId));
    }

    @PostMapping
    public ResponseEntity<CaseSummaryDTO> createCase(@Valid @RequestBody CreateCaseRequest request) {
        CaseSummaryDTO created = caseService.createCase(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/{caseId}/status")
    public ResponseEntity<CaseSummaryDTO> updateStatus(
            @PathVariable String caseId,
            @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(caseService.updateStatus(caseId, request.status()));
    }

    // ── Summary (notes) sub-resource ─────────────────────────────────────────

    @GetMapping("/{caseId}/summaries")
    public ResponseEntity<List<SummaryNoteDTO>> getSummaries(@PathVariable String caseId) {
        caseService.getCaseById(caseId); // 404 if case does not exist
        List<SummaryNoteDTO> result = caseSummaryRepository
                .findByCaseIdOrderByCreatedAtDesc(caseId)
                .stream()
                .map(SummaryNoteDTO::fromEntity)
                .toList();
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{caseId}/summaries")
    public ResponseEntity<SummaryNoteDTO> addSummary(
            @PathVariable String caseId,
            @Valid @RequestBody CreateSummaryRequest request) {
        caseService.getCaseById(caseId); // 404 if case does not exist
        CaseSummary entity = new CaseSummary(caseId, request.agentName(), request.content(), request.isInternal());
        CaseSummary saved = caseSummaryRepository.save(entity);
        return ResponseEntity.status(HttpStatus.CREATED).body(SummaryNoteDTO.fromEntity(saved));
    }

    // ── Request / Response records ────────────────────────────────────────────

    record StatusUpdateRequest(CaseStatus status) {}

    record CreateSummaryRequest(
            @NotBlank String agentName,
            @NotBlank String content,
            boolean isInternal
    ) {}

    record SummaryNoteDTO(
            String id,
            String caseId,
            String agentName,
            String content,
            boolean isInternal,
            LocalDateTime createdAt
    ) {
        static SummaryNoteDTO fromEntity(CaseSummary s) {
            return new SummaryNoteDTO(
                    s.getId(), s.getCaseId(), s.getAgentName(),
                    s.getContent(), s.isInternal(), s.getCreatedAt()
            );
        }
    }
}
