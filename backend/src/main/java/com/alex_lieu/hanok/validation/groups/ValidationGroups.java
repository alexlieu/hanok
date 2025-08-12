package com.alex_lieu.hanok.validation.groups;

import jakarta.validation.GroupSequence;
import jakarta.validation.groups.Default;

public class ValidationGroups {
    public interface OrderChecks {
    }

    public interface PaymentChecks {
    }

    public interface CardChecks {
    }

    public interface TokenChecks {
    }

    public interface PreConditionChecks {
    }

    public interface FormatAndLogicChecks {
    }

    @GroupSequence({
            Default.class,
            OrderChecks.class,
            PaymentChecks.class,
            CardChecks.class,
            PreConditionChecks.class,
            FormatAndLogicChecks.class,
    })
    public interface FullCardValidationSequence {
    }

    @GroupSequence({
            Default.class,
            OrderChecks.class,
            PaymentChecks.class,
            TokenChecks.class,
    })
    public interface FullTokenizedValidationSequence {
    }
}
