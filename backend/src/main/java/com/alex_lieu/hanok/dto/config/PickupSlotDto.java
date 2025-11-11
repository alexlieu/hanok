package com.alex_lieu.hanok.dto.config;

import java.io.Serializable;
import java.time.LocalTime;

// The enum identifier would normally be called the key, but it is named value here because
// that is how it will be used in the client.
public record PickupSlotDto(String value, String label, LocalTime start, LocalTime end) implements Serializable {
}
