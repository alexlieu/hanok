package com.alex_lieu.hanok.dto.config;

import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.Set;

public record ValidStateProvincesRegionsDto(
                LinkedHashMap<String, String> US_STATES,
                LinkedHashMap<String, String> CA_PROVINCES,
                Set<String> KR_PROVINCES) implements Serializable {
}
