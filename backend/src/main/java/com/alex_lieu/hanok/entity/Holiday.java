package com.alex_lieu.hanok.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Getter
@Setter
@Entity
public class Holiday {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    private String name;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    public static class HolidayBuilder {
        public Holiday build() {
            if (startDate.isAfter(endDate)) {
                throw new IllegalArgumentException(
                        "Holiday end date (" + endDate + ") cannot be before the start date (" + startDate + ")"
                );
            }
            return new Holiday(id, name, startDate, endDate);
        }
    }
}
