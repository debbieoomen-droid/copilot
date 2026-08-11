package nl.rabobank.casesummary.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public final class ValidIbanValidator implements ConstraintValidator<ValidIban, String> {

    private boolean allowBlank;

    @Override
    public void initialize(ValidIban constraintAnnotation) {
        this.allowBlank = constraintAnnotation.allowBlank();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return allowBlank;
        }

        String normalized = IbanValidator.normalize(value);
        if (normalized.isBlank()) {
            return allowBlank;
        }

        return IbanValidator.isValidIban(normalized);
    }
}
