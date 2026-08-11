package nl.rabobank.casesummary.validation;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ValidIbanValidatorTest {

    private static ValidatorFactory validatorFactory;
    private static Validator validator;

    private record Payload(@ValidIban(allowBlank = true) String iban) {
    }

    private record RequiredPayload(@ValidIban(allowBlank = false) String iban) {
    }

    @BeforeAll
    static void setUp() {
        validatorFactory = Validation.buildDefaultValidatorFactory();
        validator = validatorFactory.getValidator();
    }

    @AfterAll
    static void tearDown() {
        validatorFactory.close();
    }

    @Test
    void allowBlankTrue_allowsNullAndBlank() {
        assertThat(validator.validate(new Payload(null))).isEmpty();
        assertThat(validator.validate(new Payload("  "))).isEmpty();
    }

    @Test
    void allowBlankFalse_rejectsNullAndBlank() {
        assertThat(validator.validate(new RequiredPayload(null))).isNotEmpty();
        assertThat(validator.validate(new RequiredPayload("  "))).isNotEmpty();
    }

    @Test
    void rejectsInvalidIban() {
        assertThat(validator.validate(new Payload("NL91ABNA0417164301"))).isNotEmpty();
    }

    @Test
    void acceptsValidIban() {
        assertThat(validator.validate(new Payload("NL91 ABNA 0417 1643 00"))).isEmpty();
    }
}
