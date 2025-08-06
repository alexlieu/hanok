package com.alex_lieu.hanok.entity;

import com.alex_lieu.hanok.validation.groups.ValidationGroups;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;
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
public class TokenizedPaymentDetails {
    @NotBlank(message = "tokenized.payment.token.notBlank", groups = {ValidationGroups.TokenChecks.class})
    @Size(min = 10, max = 100, message = "tokenized.payment.token.size", groups = {ValidationGroups.TokenChecks.class})
    @Column(unique = true, nullable = false)
    private String token;

    @Size(min = 4, max = 4, message = "tokenized.payment.lastFour.size", groups = {ValidationGroups.TokenChecks.class})
    @Pattern(regexp = "^[0-9]+$", message = "tokenized.payment.lastFour.digits", groups = {ValidationGroups.TokenChecks.class})
    private String lastFour;

//    @Override
//    public final boolean equals(Object o) {
//        if (this == o) return true;
//        if (o == null || getClass() != o.getClass()) return false;
//        TokenizedPaymentDetails that = (TokenizedPaymentDetails) o;
//        return Objects.equals(token, that.token) && Objects.equals(lastFour, that.lastFour);
//    }
//
//    @Override
//    public final int hashCode() {
//        return Objects.hash(token, lastFour);
//    }
}
