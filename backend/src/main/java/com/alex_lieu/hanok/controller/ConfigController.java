package com.alex_lieu.hanok.controller;

import com.alex_lieu.hanok.dto.config.PickupRulesDto;
import com.alex_lieu.hanok.dto.config.ValidStateProvincesRegionsDto;
import com.alex_lieu.hanok.service.PickupService;
import com.alex_lieu.hanok.validation.billing_address.StateProvinceRegionLogic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequestMapping("/api/config")
@CrossOrigin(origins = "http://localhost:5173/")
public class ConfigController {
    private final PickupService pickupService;

    @Autowired
    public ConfigController(PickupService pickupService) {
        this.pickupService = pickupService;
    }

    @GetMapping("/pickup-rules")
    public ResponseEntity<PickupRulesDto> getPickupRules() {
        return ResponseEntity.ok(pickupService.getPickupRules());
    }

    @GetMapping("addresses/statesProvincesRegions")
    public ResponseEntity<ValidStateProvincesRegionsDto> getValidStateProvincesRegions() {
        Set<String> US_STATES = StateProvinceRegionLogic.US_STATES;
        Set<String> CA_PROVINCES = StateProvinceRegionLogic.CA_PROVINCES;
        Set<String> KR_PROVINCES = StateProvinceRegionLogic.KR_PROVINCES;
        return ResponseEntity.ok(new ValidStateProvincesRegionsDto(US_STATES, CA_PROVINCES, KR_PROVINCES));
    }
}
