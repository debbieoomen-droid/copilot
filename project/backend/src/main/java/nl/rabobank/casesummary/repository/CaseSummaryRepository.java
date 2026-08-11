package nl.rabobank.casesummary.repository;

import nl.rabobank.casesummary.model.CaseSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CaseSummaryRepository extends JpaRepository<CaseSummary, String> {

    List<CaseSummary> findByCaseIdOrderByCreatedAtDesc(String caseId);
}
