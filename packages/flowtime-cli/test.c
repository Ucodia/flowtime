#include "flowtime.h"
#include <stdio.h>

void test_fromDate(const char *filepath) {
  FILE *file = fopen(filepath, "r");
  if (!file) {
    perror("Failed to open test data file");
    return;
  }

  char dateStr[20];
  flowtime_t expected;
  int testCaseCount = 0;
  char line[100]; // Assuming a line won't exceed 100 characters

  while (fgets(line, sizeof(line), file)) {
    if (sscanf(line, "%19s,%d:%d:%d", dateStr, &expected.hour, &expected.minute,
               &expected.second) == 4) {
      struct tm date;
      strptime(dateStr, "%Y-%m-%dT%H:%M:%S", &date);
      flowtime_t actual = date_to_flowtime(&date);

      if (!(actual.hour == expected.hour && actual.minute == expected.minute &&
            actual.second == expected.second)) {
        printf("❌ Test failed for date %s. Expected time: %d:%d:%d but got "
               "time: %d:%d:%d\n",
               dateStr, expected.hour, expected.minute, expected.second,
               actual.hour, actual.minute, actual.second);
        fclose(file);
        return;
      }

      testCaseCount++;
    }
  }

  fclose(file);
  printf("✅ All known %d flowtime values test passed\n", testCaseCount);
}

void test_uniqueHourMinutePairs() {
  // Create arrays to store actual and expected pairs
  struct pair {
    int hour;
    int minute;
  };
  struct pair actuals[24 * 60];
  struct pair expected[24 * 60];
  int pair_count = 0;

  // Generate test data
  struct tm date = {0};
  date.tm_year = 100; // year 2000 (years since 1900)
  date.tm_mday = 1;   // first day of month
  date.tm_mon = 0;    // January

  // Generate all hour-minute pairs
  for (int h = 0; h < 24; h++) {
    for (int m = 0; m < 60; m++) {
      // Set time and get flowtime
      date.tm_hour = h;
      date.tm_min = m;
      flowtime_t flowtime = date_to_flowtime(&date);

      // Store actual result
      actuals[pair_count].hour = flowtime.hour;
      actuals[pair_count].minute = flowtime.minute;

      // Store expected result
      expected[pair_count].hour = h;
      expected[pair_count].minute = m;

      pair_count++;
    }
  }

  // Sort actuals array
  for (int i = 0; i < pair_count - 1; i++) {
    for (int j = 0; j < pair_count - i - 1; j++) {
      if (actuals[j].hour > actuals[j + 1].hour ||
          (actuals[j].hour == actuals[j + 1].hour &&
           actuals[j].minute > actuals[j + 1].minute)) {
        struct pair temp = actuals[j];
        actuals[j] = actuals[j + 1];
        actuals[j + 1] = temp;
      }
    }
  }

  // Compare arrays
  for (int i = 0; i < pair_count; i++) {
    if (actuals[i].hour != expected[i].hour ||
        actuals[i].minute != expected[i].minute) {
      printf("❌ Test failed at index %d. Expected %d:%d but got %d:%d\n", i,
             expected[i].hour, expected[i].minute, actuals[i].hour,
             actuals[i].minute);
      return;
    }
  }

  printf("✅ All hour-minute pairs test passed\n");
}

int main(int argc, char *argv[]) {
  if (argc != 2) {
    printf("Usage: %s <path_to_test_data.csv>\n", argv[0]);
    return 1;
  }
  test_fromDate(argv[1]);
  test_uniqueHourMinutePairs();
  return 0;
}
