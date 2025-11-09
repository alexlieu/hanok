package com.alex_lieu.hanok.validation.payment;

import jakarta.validation.ConstraintValidatorContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

/**
 * Unit test for CardNumberValidator
 * This test verifies that the CardNumberValidator correctly validates credit
 * card numbers.
 *
 */
@DisplayName("CardNumberValidator Unit Tests")
class CardNumberValidatorTest {

    private CardNumberValidator validator;
    private ConstraintValidatorContext context;

    /**
     * Setup runs before each test method
     * This ensures we have a fresh validator and context for each test
     */
    @BeforeEach
    void setUp() {
        validator = new CardNumberValidator();
        // Mock the ConstraintValidatorContext - we don't need its full functionality
        context = mock(ConstraintValidatorContext.class);

        // Set up the mock to return more mocks when methods are called
        // This creates a chain: context.buildConstraintViolationWithTemplate() returns
        // something that can call .addConstraintViolation()
        //
        // The builder is necessary so then when the validator tries to report an error,
        // the test doesn't crash.
        ConstraintValidatorContext.ConstraintViolationBuilder builder = mock(
                ConstraintValidatorContext.ConstraintViolationBuilder.class);

        when(context.buildConstraintViolationWithTemplate(anyString())).thenReturn(builder);
        when(builder.addConstraintViolation()).thenReturn(context);
    }

    // =========================================
    // TESTS FOR VALID CARD NUMBERS
    // =========================================

    @Test
    @DisplayName("Should accept valid 16-digit Visa card number")
    void shouldAcceptValid16DigitVisa() {
        // Valid Visa card with correct Luhn checksum
        String validVisa = "4532015112830366";
        assertTrue(validator.isValid(validVisa, context),
                "Valid 16-digit Visa should pass validation");
    }

    @Test
    @DisplayName("Should accept valid 16-digit Mastercard number")
    void shouldAcceptValid16DigitMastercard() {
        // Valid Mastercard with correct Luhn checksum (starts with 51)
        String validMastercard = "5555555555554444";
        assertTrue(validator.isValid(validMastercard, context),
                "Valid 16-digit Mastercard should pass validation");
    }

    @Test
    @DisplayName("Should accept valid 15-digit Amex card number")
    void shouldAcceptValid15DigitAmex() {
        // Valid Amex with correct Luhn checksum
        String validAmex = "378282246310005";
        assertTrue(validator.isValid(validAmex, context),
                "Valid 15-digit Amex should pass validation");
    }

    @Test
    @DisplayName("Should accept Visa card with spaces and formatting")
    void shouldAcceptVisaWithSpaces() {
        // Card number with spaces should be cleaned and validated
        String visaWithSpaces = "4532 0151 1283 0366";
        assertTrue(validator.isValid(visaWithSpaces, context),
                "Visa with spaces should be cleaned and validated");
    }

    @Test
    @DisplayName("Should accept Visa card with dashes")
    void shouldAcceptVisaWithDashes() {
        // Card number with dashes should be cleaned and validated
        String visaWithDashes = "4532-0151-1283-0366";
        assertTrue(validator.isValid(visaWithDashes, context),
                "Visa with dashes should be cleaned and validated");
    }

    @Test
    @DisplayName("Should accept valid 13-digit Visa card number")
    void shouldAcceptValid13DigitVisa() {
        // Valid 13-digit Visa with correct Luhn checksum
        String valid13DigitVisa = "4222222222222";
        assertTrue(validator.isValid(valid13DigitVisa, context),
                "Valid 13-digit Visa should pass validation");
    }

    // =========================================
    // TESTS FOR NULL AND EMPTY INPUTS
    // =========================================

    @Test
    @DisplayName("Should accept null input")
    void shouldAcceptNullInput() {
        // According to the validator, null should return true (optional field)
        assertTrue(validator.isValid(null, context),
                "Null input should be considered valid (optional field)");

        // Verify context methods were NOT called (no constraint violation)
        verify(context, never()).buildConstraintViolationWithTemplate(anyString());
    }

    @Test
    @DisplayName("Should accept empty string")
    void shouldAcceptEmptyString() {
        assertTrue(validator.isValid("", context),
                "Empty string should be considered valid");

        verify(context, never()).buildConstraintViolationWithTemplate(anyString());
    }

    @Test
    @DisplayName("Should reject whitespace-only string")
    void shouldRejectWhitespaceOnlyString() {
        // Whitespace-only becomes empty after cleaning, which has length 0, failing
        // length check
        assertFalse(validator.isValid("   ", context),
                "Whitespace-only string should be rejected (becomes empty after cleaning)");
    }

    // =========================================
    // TESTS FOR INVALID LENGTHS
    // =========================================

    @Test
    @DisplayName("Should reject card number with invalid length (12 digits)")
    void shouldRejectInvalidLength12Digits() {
        // 12 digits - too short
        String invalidLength = "123456789012";
        assertFalse(validator.isValid(invalidLength, context),
                "12-digit card number should be rejected");
    }

    @Test
    @DisplayName("Should reject card number with invalid length (14 digits)")
    void shouldRejectInvalidLength14Digits() {
        // 14 digits - invalid length
        String invalidLength = "12345678901234";
        assertFalse(validator.isValid(invalidLength, context),
                "14-digit card number should be rejected");
    }

    @Test
    @DisplayName("Should reject card number with invalid length (17 digits)")
    void shouldRejectInvalidLength17Digits() {
        // 17 digits - invalid length
        String invalidLength = "12345678901234567";
        assertFalse(validator.isValid(invalidLength, context),
                "17-digit card number should be rejected");
    }

    // =========================================
    // TESTS FOR INVALID LUHN CHECKSUM
    // =========================================

    @Test
    @DisplayName("Should reject card number with invalid Luhn checksum")
    void shouldRejectInvalidLuhnChecksum() {
        // This looks like a valid Visa format, but has wrong check digit
        String invalidLuhn = "4532015112830365"; // Last digit changed from 6 to 5
        assertFalse(validator.isValid(invalidLuhn, context),
                "Card number with invalid Luhn checksum should be rejected");
    }

    // =========================================
    // TESTS FOR NON-ACCEPTED BANKS
    // =========================================

    @Test
    @DisplayName("Should reject Discover card (not an accepted bank)")
    void shouldRejectDiscoverCard() {
        // Discover cards start with 6011, which is not in our accepted list
        String discoverCard = "6011111111111117";
        assertFalse(validator.isValid(discoverCard, context),
                "Discover card should be rejected (not an accepted bank)");

        // Verify that a custom error message was set
        verify(context).buildConstraintViolationWithTemplate(
                "Your card number is not from an accepted bank (Visa, MC, Amex).");
    }

    @Test
    @DisplayName("Should reject card from non-accepted bank")
    void shouldRejectNonAcceptedBank() {
        // Random card number not from accepted banks
        String randomCard = "1234567890123456";
        assertFalse(validator.isValid(randomCard, context),
                "Card from non-accepted bank should be rejected");
    }

    // =========================================
    // TESTS FOR VALID BANK BUT WRONG LENGTH
    // =========================================

    @Test
    @DisplayName("Should reject Amex card with wrong length (16 digits)")
    void shouldRejectAmexWithWrongLength() {
        // Amex should be 15 digits, not 16
        // Using a 16-digit number starting with Amex prefix (but this will fail before
        // reaching bank check)
        String amexWrongLength = "3739123456789019";
        assertFalse(validator.isValid(amexWrongLength, context),
                "Amex card must be 15 digits, not 16");

        // Note: This may fail Luhn check or length check before reaching bank
        // validation
        // So we just verify it's rejected
    }

    @Test
    @DisplayName("Should reject Mastercard with wrong length (15 digits)")
    void shouldRejectMastercardWithWrongLength() {
        // Mastercard should be 16 digits, not 15
        // This is a 15-digit number starting with Mastercard prefix
        String mastercardWrongLength = "552345678901234";
        assertFalse(validator.isValid(mastercardWrongLength, context),
                "Mastercard card must be 16 digits, not 15");
    }

    // =========================================
    // EDGE CASE TESTS
    // =========================================

    @Test
    @DisplayName("Should handle card number with mixed formatting")
    void shouldHandleMixedFormatting() {
        // Card number with mixed spaces, dashes, and other characters
        String mixedFormat = "4532-0151 1283_0366";
        assertTrue(validator.isValid(mixedFormat, context),
                "Should clean mixed formatting and validate");
    }

    @Test
    @DisplayName("Should reject card with only letters")
    void shouldRejectCardWithOnlyLetters() {
        // After cleaning non-digits, this becomes empty (length 0), which fails length
        // check
        String lettersOnly = "abcdefghijklmnop";
        assertFalse(validator.isValid(lettersOnly, context),
                "Letters-only becomes empty after cleaning, which has invalid length");
    }

    @Test
    @DisplayName("Should handle Mastercard starting with 54")
    void shouldHandleMastercard54Prefix() {
        // Mastercard range includes 2221-2720 and 51-55
        // Using a valid 54 Mastercard with valid Luhn checksum
        String mastercard54 = "5498587000000004";
        assertTrue(validator.isValid(mastercard54, context),
                "Mastercard starting with 54 should be accepted");
    }
}
