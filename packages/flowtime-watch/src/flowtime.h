#include "watch.h"
#include <stdint.h>
#include <time.h>

typedef struct {
  uint32_t hour;
  uint32_t minute;
  uint32_t second;
} flowtime_t;

uint32_t *random_sequence(uint32_t n, uint32_t seed);
flowtime_t date_to_flowtime(watch_date_time *date);
