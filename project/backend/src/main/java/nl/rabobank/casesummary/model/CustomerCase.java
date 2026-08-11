package nl.rabobank.casesummary.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Klantzaak entiteit.
 * Vertegenwoordigt een individuele klantinteractie (klacht, vraag, verzoek).
 */
@Entity
@Table(name = "customer_cases")
public class CustomerCase {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String customerId;

    @Column(nullable = false)
    private String customerName;

    private String iban;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CaseCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CaseStatus status;

    @Column(nullable = false)
    private String subject;

    @Column(length = 4000)
    private String description;

    private String assignedAgent;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime resolvedAt;

    // ── Constructors ─────────────────────────────────────────────────────────

    public CustomerCase() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = CaseStatus.OPEN;
    }

    public CustomerCase(String customerId, String customerName, CaseCategory category, String subject) {
        this();
        this.customerId = customerId;
        this.customerName = customerName;
        this.category = category;
        this.subject = subject;
    }

    // ── Getters & Setters ────────────────────────────────────────────────────

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getIban() { return iban; }
    public void setIban(String iban) { this.iban = iban; }

    public CaseCategory getCategory() { return category; }
    public void setCategory(CaseCategory category) { this.category = category; }

    public CaseStatus getStatus() { return status; }
    public void setStatus(CaseStatus status) { this.status = status; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAssignedAgent() { return assignedAgent; }
    public void setAssignedAgent(String assignedAgent) { this.assignedAgent = assignedAgent; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
}
