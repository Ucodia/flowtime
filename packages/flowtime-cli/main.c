#include "flowtime.h"
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <stdbool.h>

#define VERSION "2.0.0"

void print_help() {
  printf("flowtime - Display time in flowtime format\n\n");
  printf("Usage:\n");
  printf("  flowtime [options]\n\n");
  printf("Options:\n");
  printf("  -h, --help     Show this help message\n");
  printf("  -v, --version  Show version information\n");
  printf("  -c, --clock    Run in continuous clock mode\n");
}

void print_version() {
  printf("flowtime version %s\n", VERSION);
}

void print_flowtime(bool continuous) {
  time_t t;
  struct tm date;
  time(&t);
  date = *localtime(&t);
  flowtime_t result = date_to_flowtime(&date);
  printf(continuous ? "\r%02d:%02d:%02d" : "%02d:%02d:%02d\n", 
         result.hour, result.minute, result.second);
}

void print_flowtime_continuous() {
  while (1) {
    print_flowtime(true);
    fflush(stdout);
    sleep(1);
  }
}

int main(int argc, char *argv[]) {
  if (argc > 1) {
    if (strcmp(argv[1], "-h") == 0 || strcmp(argv[1], "--help") == 0) {
      print_help();
      return 0;
    }
    if (strcmp(argv[1], "-v") == 0 || strcmp(argv[1], "--version") == 0) {
      print_version();
      return 0;
    }
    if (strcmp(argv[1], "-c") == 0 || strcmp(argv[1], "--clock") == 0) {
      print_flowtime_continuous();
      return 0;
    }
    // Invalid parameter
    printf("Unknown option: %s\n", argv[1]);
    printf("Try 'flowtime --help' for more information.\n");
    return 1;
  }
  
  print_flowtime(false);
  return 0;
}
