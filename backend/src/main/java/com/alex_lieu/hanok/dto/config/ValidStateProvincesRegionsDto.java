package com.alex_lieu.hanok.dto.config;

import java.io.Serializable;
import java.util.Set;

public record ValidStateProvincesRegionsDto(
        Set<String> US_STATES,
        Set<String> CA_PROVINCES,
        Set<String> KR_PROVINCES
) implements Serializable {
}
