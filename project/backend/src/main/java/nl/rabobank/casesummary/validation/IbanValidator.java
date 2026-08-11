package nl.rabobank.casesummary.validation;

import java.util.Locale;

public final class IbanValidator {

    private IbanValidator() {
    }

    public static boolean isValidIban(String iban) {
        if (iban == null) {
            return false;
        }

        String normalized = normalize(iban);
        if (normalized.isBlank()) {
            return false;
        }

        if (normalized.length() < 15 || normalized.length() > 34) {
            return false;
        }

        if (!Character.isLetter(normalized.charAt(0)) || !Character.isLetter(normalized.charAt(1))) {
            return false;
        }

        if (!Character.isDigit(normalized.charAt(2)) || !Character.isDigit(normalized.charAt(3))) {
            return false;
        }

        for (int i = 4; i < normalized.length(); i++) {
            char c = normalized.charAt(i);
            if (!Character.isLetterOrDigit(c)) {
                return false;
            }
        }

        String rearranged = normalized.substring(4) + normalized.substring(0, 4);

        int remainder = 0;
        for (int i = 0; i < rearranged.length(); i++) {
            char c = rearranged.charAt(i);
            if (Character.isDigit(c)) {
                remainder = (remainder * 10 + (c - '0')) % 97;
                continue;
            }

            if (!Character.isLetter(c)) {
                return false;
            }

            int value = Character.toUpperCase(c) - 'A' + 10;
            remainder = (remainder * 10 + (value / 10)) % 97;
            remainder = (remainder * 10 + (value % 10)) % 97;
        }

        return remainder == 1;
    }

    public static String normalize(String iban) {
        if (iban == null) {
            return "";
        }
        return iban.replace(" ", "").trim().toUpperCase(Locale.ROOT);
    }
}
