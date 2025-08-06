package com.alex_lieu.hanok.entity;

import com.alex_lieu.hanok.validation.expiry_date.ValidCardExpiration;
import com.alex_lieu.hanok.validation.groups.ValidationGroups;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Getter
@Setter
@EqualsAndHashCode
@Embeddable
@ValidCardExpiration(groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
public class CardDetails {
    @NotBlank(message = "{card.last-four.not-blank}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.PreConditionChecks.class})
    @Size(min = 4, max = 4, message = "{card.last-four.size}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
    @Pattern(regexp = "^[0-9]+$", message = "{card.last-four.digits}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
    private String lastFour;

    @Column(unique = true)
    @NotBlank(message = "{card.token.not-blank}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.PreConditionChecks.class})
    @Size(min = 10, max = 200, message = "{card.token.size}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
    private String token;

    @NotBlank(message = "{card.expiry.month.not-blank}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.PreConditionChecks.class})
    @Pattern(regexp = "^(0[1-9]|1[0-2])$", message = "{card.expiry.month.format}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
    // MM format (01-12)
    private String expiryMonth;

    @NotBlank(message = "{card.expiry.year.not-blank}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.PreConditionChecks.class})
    @Pattern(regexp = "^(202[5-9]|20[3-9][0-9]|2040)$", message = "{card.expiry.year.format}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
    private String expiryYear;

    @NotBlank(message = "{card.holder-name.not-blank}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.PreConditionChecks.class})
    @Size(min = 2, max = 100, message = "{card.holder-name.size}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
    @Pattern(regexp = "^(?!.*[0-9])(?=.*\\s)[\\p{L}\\p{M}\\p{Pd}' ]+$", message = "{card.holder-name.pattern}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.FormatAndLogicChecks.class})
    private String holderName;

    @Valid
    @NotNull(message = "{card.billing-address.not-null}", groups = {ValidationGroups.CardChecks.class, ValidationGroups.CardChecks.class})
    @Embedded
    private BillingAddress billingAddress;

//    @Override
//    public final boolean equals(Object o) {
//        if (this == o) return true;
//        if (o == null || getClass() != o.getClass()) return false;
//        CardDetails that = (CardDetails) o;
//        return Objects.equals(lastFour, that.lastFour) &&
//                Objects.equals(token, that.token) &&
//                Objects.equals(expiryMonth, that.expiryMonth) &&
//                Objects.equals(expiryYear, that.expiryYear) &&
//                Objects.equals(holderName, that.holderName) &&
//                Objects.equals(billingAddress, that.billingAddress);
//    }
//
//    @Override
//    public final int hashCode() {
//        return Objects.hash(lastFour, token, expiryMonth, expiryYear, holderName, billingAddress);
//    }
}

