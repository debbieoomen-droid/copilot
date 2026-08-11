package nl.rabobank.casesummary.repository;

import nl.rabobank.casesummary.model.CaseStatus;
import nl.rabobank.casesummary.model.CustomerCase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository voor klantzaken.
 * Alle queries gebruiken geparametriseerde statements (geen string concatenatie).
 */
@Repository
public interface CaseRepository extends JpaRepository<CustomerCase, String> {

    Page<CustomerCase> findByStatus(CaseStatus status, Pageable pageable);

    List<CustomerCase> findByCustomerIdOrderByCreatedAtDesc(String customerId);

    @Query("SELECT c FROM CustomerCase c WHERE c.assignedAgent = :agent AND c.status NOT IN ('RESOLVED', 'CLOSED')")
    List<CustomerCase> findActiveCasesByAgent(@Param("agent") String agentName);

    @Query("SELECT c FROM CustomerCase c WHERE c.createdAt BETWEEN :start AND :end")
    List<CustomerCase> findByDateRange(
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end
    );

    long countByStatus(CaseStatus status);
}
