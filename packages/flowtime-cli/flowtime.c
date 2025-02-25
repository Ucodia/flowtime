#include "flowtime.h"
#include <stdint.h>
#include <stdlib.h>

uint32_t *random_sequence(uint32_t n, uint32_t seed) {
  uint32_t *result = malloc(n * sizeof(uint32_t));
  if (!result)
    return NULL;
  uint32_t state = seed;
  for (int i = 0; i < n; i++) {
    state ^= state << 13;
    state ^= state >> 17;
    state ^= state << 5;
    int j = (uint32_t)(((double)state / 4294967296) * (i + 1));
    result[i] = result[j];
    result[j] = i;
  }
  return result;
}

flowtime_t date_to_flowtime(const struct tm *date) {
  static uint32_t cached_hours_seed = 0;
  static uint32_t cached_minutes_seed = 0;
  static uint32_t *cached_hours_sequence = NULL;
  static uint32_t *cached_minutes_sequence = NULL;

  uint32_t year = date->tm_year + 1900;
  uint32_t month = date->tm_mon + 1;
  uint32_t day = date->tm_mday;
  uint32_t hour = date->tm_hour;
  uint32_t minute = date->tm_min;
  uint32_t second = date->tm_sec;

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
