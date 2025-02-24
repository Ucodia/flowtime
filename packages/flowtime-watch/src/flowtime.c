#include "flowtime.h"
#include "watch.h"
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

uint32_t *random_sequence(uint32_t n, uint32_t seed) {
  uint32_t *result = malloc(n * sizeof(uint32_t));
  if (!result)
    return NULL;
  uint32_t state = seed;
  for (uint32_t i = 0; i < n; i++) {
    state ^= state << 13;
    state ^= state >> 17;
    state ^= state << 5;
    int j = (uint32_t)(((double)state / 4294967296) * (i + 1));
    result[i] = result[j];
    result[j] = i;
  }
  return result;
}

flowtime_t date_to_flowtime(watch_date_time *date) {
  static uint32_t cached_hours_seed = 0;
  static uint32_t cached_minutes_seed = 0;
  static uint32_t *cached_hours_sequence = NULL;
  static uint32_t *cached_minutes_sequence = NULL;

  uint32_t year = date->unit.year + 2020;
  uint32_t month = date->unit.month;
  uint32_t day = date->unit.day;
  uint32_t hour = date->unit.hour;
  uint32_t minute = date->unit.minute;
  uint32_t second = date->unit.second;

  uint32_t hoursSeed = year * 10000 + month * 100 + day;
  uint32_t minutesSeed = hoursSeed * 100 + hour;

  // Update hours sequence if day changes
  if (hoursSeed != cached_hours_seed) {
    free(cached_hours_sequence);
    cached_hours_sequence = random_sequence(24, hoursSeed);
    cached_hours_seed = hoursSeed;
  }

  // Update minutes sequence if hour changes
  if (minutesSeed != cached_minutes_seed) {
    free(cached_minutes_sequence);
    cached_minutes_sequence = random_sequence(60, minutesSeed);
    cached_minutes_seed = minutesSeed;
  }

  flowtime_t flowtime;
  flowtime.hour = cached_hours_sequence ? cached_hours_sequence[hour] : hour;
  flowtime.minute =
      cached_minutes_sequence ? cached_minutes_sequence[minute] : minute;
  flowtime.second = second;

  return flowtime;
}
