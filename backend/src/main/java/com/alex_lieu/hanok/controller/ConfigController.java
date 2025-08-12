package com.alex_lieu.hanok.controller;

import com.alex_lieu.hanok.dto.config.PickupRulesDto;
import com.alex_lieu.hanok.service.PickupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/config")
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
}
