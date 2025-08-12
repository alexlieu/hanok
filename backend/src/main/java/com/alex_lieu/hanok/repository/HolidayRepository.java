package com.alex_lieu.hanok.repository;

import com.alex_lieu.hanok.entity.Holiday;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface HolidayRepository extends JpaRepository<Holiday, Long> {
    List<Holiday> findByStartDateBetweenOrEndDateBetween(@NotNull LocalDate startDateAfter, @NotNull LocalDate startDateBefore, @NotNull LocalDate endDateAfter, @NotNull LocalDate endDateBefore);
}
