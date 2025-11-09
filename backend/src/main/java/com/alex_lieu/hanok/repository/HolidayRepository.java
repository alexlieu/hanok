package com.alex_lieu.hanok.repository;

import com.alex_lieu.hanok.entity.Holiday;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface HolidayRepository extends JpaRepository<Holiday, Long> {
    /**
     * Finds all holidays that have at least one day of overlap with the given date range.
     *
     * @param startDate The start date of the range to check.
     * @param endDate   The end date of the range to check.
     * @return A list of all the holidays overlap with the given range.
     */
    @Query("SELECT h FROM Holiday h WHERE h.startDate <= :endDate AND h.endDate >= :startDate")
    List<Holiday> findOverlappingHolidays(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
