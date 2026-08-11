package nl.rabobank.casesummary.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Samenvatting-notitie bij een klantzaak.
 * Kan intern (alleen medewerkers) of extern (zichtbaar voor klant) zijn.
 */
@Entity
@Table(name = "case_summaries")
public class CaseSummary {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String caseId;

    @Column(nullable = false)
    private String agentName;

    @Column(length = 4000, nullable = false)
    private String content;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private boolean isInternal;

    // ── Constructors ─────────────────────────────────────────────────────────

    public CaseSummary() {
        this.createdAt = LocalDateTime.now();
        this.isInternal = true;
    }

    public CaseSummary(String caseId, String agentName, String content, boolean isInternal) {
        this();
        this.caseId = caseId;
        this.agentName = agentName;
        this.content = content;
        this.isInternal = isInternal;
    }

    // ── Getters & Setters ────────────────────────────────────────────────────

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCaseId() { return caseId; }
    public void setCaseId(String caseId) { this.caseId = caseId; }

    public String getAgentName() { return agentName; }
    public void setAgentName(String agentName) { this.agentName = agentName; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public boolean isInternal() { return isInternal; }
    public void setInternal(boolean internal) { this.isInternal = internal; }
}
