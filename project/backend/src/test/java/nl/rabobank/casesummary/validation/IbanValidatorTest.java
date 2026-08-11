package nl.rabobank.casesummary.validation;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class IbanValidatorTest {

    @Test
    void returnsFalseForNull() {
        assertThat(IbanValidator.isValidIban(null)).isFalse();
    }

    @Test
    void returnsFalseForBlank() {
        assertThat(IbanValidator.isValidIban("   ")).isFalse();
    }

    @Test
    void acceptsValidIbanWithSpacesAndLowercase() {
        assertThat(IbanValidator.isValidIban("nl91 abna 0417 1643 00")).isTrue();
    }

    @Test
    void rejectsInvalidChecksum() {
        assertThat(IbanValidator.isValidIban("NL91ABNA0417164301")).isFalse();
    }

    @Test
    void rejectsNonAlphanumericCharacters() {
        assertThat(IbanValidator.isValidIban("NL91ABNA0417-1643-00")).isFalse();
    }

    @Test
    void rejectsTooShort() {
        assertThat(IbanValidator.isValidIban("NL91ABNA0417")).isFalse();
    }

    @Test
    void rejectsTooLong() {
        assertThat(IbanValidator.isValidIban("NL" + "9".repeat(40))).isFalse();
    }

    @Test
    void normalizeRemovesSpacesAndUppercases() {
        assertThat(IbanValidator.normalize(" nl91 abna 0417 1643 00 "))
            .isEqualTo("NL91ABNA0417164300");
    }
}
