package nl.rabobank.casesummary.config;

import nl.rabobank.casesummary.model.*;
import nl.rabobank.casesummary.repository.CaseRepository;
import nl.rabobank.casesummary.repository.CaseSummaryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Laadt testdata bij het opstarten van de applicatie.
 * Alleen actief met H2 in-memory database.
 */
@Configuration
public class DataLoader {

    private static final Logger log = LoggerFactory.getLogger(DataLoader.class);

    @Bean
    CommandLineRunner loadSampleData(CaseRepository caseRepo, CaseSummaryRepository summaryRepo) {
        return args -> {
            // Zaak 1: Klacht over dubbele afschrijving
            CustomerCase case1 = new CustomerCase(
                "KL-2024-001", "Jan de Vries", CaseCategory.COMPLAINT, "Dubbele afschrijving energierekening"
            );
            case1.setIban("NL91RABO0315273637");
            case1.setDescription("Klant meldt dat zijn energierekening twee keer is afgeschreven op 15 januari. Bedrag: €187,50 per afschrijving.");
            case1.setStatus(CaseStatus.IN_PROGRESS);
            case1.setAssignedAgent("Fatima El-Amrani");
            case1.setPriority(CasePriority.HIGH);
            case1.setCreatedAt(LocalDateTime.now().minusDays(3));

            // Zaak 2: Vraag over hypotheek
            CustomerCase case2 = new CustomerCase(
                "KL-2024-002", "Maria Jansen", CaseCategory.MORTGAGE, "Hypotheekrente verlenging"
            );
            case2.setIban("NL20RABO0123456789");
            case2.setDescription("Klant wil informatie over renteherziening. Huidige rente 2,8% loopt af per 1 maart 2025.");
            case2.setStatus(CaseStatus.OPEN);
            case2.setPriority(CasePriority.MEDIUM);
            case2.setCreatedAt(LocalDateTime.now().minusDays(1));

            // Zaak 3: Fraude melding
            CustomerCase case3 = new CustomerCase(
                "KL-2024-003", "Peter van Dam", CaseCategory.FRAUD_REPORT, "Onbekende transactie €2.450"
            );
            case3.setIban("NL44RABO0987654321");
            case3.setDescription("Klant ziet een onbekende overboeking van €2.450 naar een Roemeense rekening. Pas is niet gestolen.");
            case3.setStatus(CaseStatus.ESCALATED);
            case3.setAssignedAgent("Thomas Bakker");
            case3.setPriority(CasePriority.CRITICAL);
            case3.setCreatedAt(LocalDateTime.now().minusHours(6));

            // Zaak 4: Betaalprobleem
            CustomerCase case4 = new CustomerCase(
                "KL-2024-004", "Sophie de Groot", CaseCategory.PAYMENT_ISSUE, "iDEAL betaling mislukt"
            );
            case4.setIban("NL55RABO0246813579");
            case4.setDescription("Klant kan geen iDEAL betalingen doen via de Rabo App. Foutmelding: 'Sessie verlopen'.");
            case4.setStatus(CaseStatus.WAITING_CUSTOMER);
            case4.setAssignedAgent("Fatima El-Amrani");
            case4.setPriority(CasePriority.HIGH);
            case4.setCreatedAt(LocalDateTime.now().minusDays(2));

            // Zaak 5: Opgelost - rekeningprobleem
            CustomerCase case5 = new CustomerCase(
                "KL-2024-005", "Ahmed Yilmaz", CaseCategory.ACCOUNT_ISSUE, "Kan niet inloggen in Rabo App"
            );
            case5.setIban("NL77RABO0112233445");
            case5.setDescription("Klant kan niet inloggen na update van de Rabo App. Android 14, Samsung Galaxy S24.");
            case5.setStatus(CaseStatus.RESOLVED);
            case5.setAssignedAgent("Lisa van der Berg");
            case5.setPriority(CasePriority.LOW);
            case5.setCreatedAt(LocalDateTime.now().minusDays(5));
            case5.setResolvedAt(LocalDateTime.now().minusDays(4));

            // Zaak 6: Leningaanvraag
            CustomerCase case6 = new CustomerCase(
                "KL-2024-006", "Emma Willems", CaseCategory.LOAN_REQUEST, "Persoonlijke lening €15.000"
            );
            case6.setIban("NL33RABO0998877665");
            case6.setDescription("Klant wil een persoonlijke lening aanvragen van €15.000 voor een verbouwing. Inkomen: €4.200 bruto/maand.");
            case6.setStatus(CaseStatus.OPEN);
            case6.setPriority(CasePriority.MEDIUM);
            case6.setCreatedAt(LocalDateTime.now().minusHours(2));

            List<CustomerCase> savedCases = caseRepo.saveAll(List.of(case1, case2, case3, case4, case5, case6));

            // Samenvattingen voor zaak 1
            CaseSummary summary1a = new CaseSummary(case1.getId(), "Fatima El-Amrani",
                "Klant gebeld. Dubbele afschrijving bevestigd in systeem. Storno is in gang gezet, verwachte terugboeking binnen 3 werkdagen.", false);
            summary1a.setCreatedAt(LocalDateTime.now().minusDays(2));

            CaseSummary summary1b = new CaseSummary(case1.getId(), "Fatima El-Amrani",
                "Terugboeking verwerkt. Bevestigingsmail gestuurd naar klant. Wacht op bevestiging van klant dat bedrag is ontvangen.", false);
            summary1b.setCreatedAt(LocalDateTime.now().minusDays(1));

            // Samenvatting voor zaak 3 (intern)
            CaseSummary summary3a = new CaseSummary(case3.getId(), "Thomas Bakker",
                "INTERN: Transactie voldoet aan fraudepatroon type C (grensoverschrijdend, onbekend IBAN). Doorgestuurd naar Fraude-afdeling voor onderzoek.", true);
            summary3a.setInternal(true);
            summary3a.setCreatedAt(LocalDateTime.now().minusHours(4));

            summaryRepo.saveAll(List.of(summary1a, summary1b, summary3a));

            log.info("Testdata geladen: {} zaken, {} samenvattingen", savedCases.size(), 3);
        };
    }
}
