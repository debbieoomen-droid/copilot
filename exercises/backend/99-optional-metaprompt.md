# Optional — Metaprompt for IBAN Validation in Java

> Not part of the session. Take-home material.

## What to do

1. Read the metaprompt below carefully
2. Work out what makes it effective as a piece of prompt engineering
3. Implement the method from the metaprompt alone — don't read ahead to the reference solution
4. Test it against the provided examples

## The metaprompt

```java
/*
METAPROMPT:
You are an expert in international banking standards. Write a Java method
that validates International Bank Account Numbers (IBANs) with these constraints:
- IBANs contain 2 letters (country code), followed by 2 digits (check digits)
- Remaining characters are alphanumeric (country-specific format)
- Total length varies: 15-34 characters
- Check digits use the mod-97 algorithm for validation

The method should return true if valid, false otherwise.
*/

public class IbanValidator {

    public static boolean validateIban(String iban) {
        if (iban == null) {
            return false;
        }

        String normalized = iban.replaceAll("\\s+", "").toUpperCase();

        if (normalized.length() < 15 || normalized.length() > 34) {
            return false;
        }

        if (!normalized.matches("^[A-Z]{2}[0-9]{2}[A-Z0-9]+$")) {
            return false;
        }

        String rearranged = normalized.substring(4) + normalized.substring(0, 4);
        StringBuilder numericIban = new StringBuilder();

        for (char ch : rearranged.toCharArray()) {
            if (Character.isLetter(ch)) {
                numericIban.append(ch - 'A' + 10);
            } else {
                numericIban.append(ch);
            }
        }

        return mod97(numericIban.toString()) == 1;
    }

    private static int mod97(String numericIban) {
        int remainder = 0;

        for (int i = 0; i < numericIban.length(); i++) {
            char ch = numericIban.charAt(i);
            remainder = (remainder * 10 + (ch - '0')) % 97;
        }

        return remainder;
    }

    public static void main(String[] args) {
        String[][] testIbans = {
                {"DE89370400440532013000", "true"},   // Valid German IBAN
                {"GB82WEST12345698765432", "true"},    // Valid UK IBAN
                {"FR1420041010050500013M02606", "true"}, // Valid French IBAN
                {"INVALID1234567890", "false"},        // Invalid format
                {"DE89370400440532013001", "false"}    // Invalid check digits
        };

        for (String[] testIban : testIbans) {
            String iban = testIban[0];
            boolean expected = Boolean.parseBoolean(testIban[1]);
            boolean result = validateIban(iban);
            String status = result == expected ? "✓" : "✗";
            System.out.println(status + " " + iban + ": " + result);
        }
    }
}
```
