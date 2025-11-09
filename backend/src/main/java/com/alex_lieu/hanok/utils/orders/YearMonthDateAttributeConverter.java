package com.alex_lieu.hanok.utils.orders;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.sql.Date;
import java.time.YearMonth;

// This class tells JPA/Hibernate how to convert the YearMonth object into a db-friendly format.
// This label tells JPA to use it for all YearMonth fields.
@Converter(autoApply = true)
public class YearMonthDateAttributeConverter implements AttributeConverter<YearMonth, Date> {
    @Override
    public Date convertToDatabaseColumn(YearMonth attribute) {
        if (attribute != null) {
            return Date.valueOf(attribute.atDay(1));
        }
        return null;
    }

    @Override
    public YearMonth convertToEntityAttribute(Date dbDate) {
        if (dbDate != null) return YearMonth.from(dbDate.toLocalDate());
        return null;
    }
}
