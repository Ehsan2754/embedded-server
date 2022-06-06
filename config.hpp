#ifndef __CONFIG_HPP__
#define __CONFIG_HPP__

#define DEBUG
#ifdef DEBUG
#define DEBUG_PRINT(...) Serial.print(__VA_ARGS__)
#define DEBUG_PRINTLN(...) Serial.println(__VA_ARGS__)
#define DEBUG_PRINTF(...) Serial.printf(__VA_ARGS__)
#else
#define DEBUG_PRINT(...)
#define DEBUG_PRINTln(...)
#define DEBUG_PRINTf(...)
#endif

#define SERIAL_NO "lab"
#define SSID_AP "Zarnitza - " SERIAL_NO
#define SSID_PASS "zlabconfig" SERIAL_NO
#define PATH_SENDCOMMAND "/api/lab/send-command/" SERIAL_NO
#define PATH_SUBSCRIBE "/api/lab/subscribe/" SERIAL_NO
#define TIMEOUT 20
#define BUFFER_SIZE 2048
// PIN Configuration
#define PIN_TRIGGER 0 // BOOT PIN which will reset the ssid
#define PIN_LED 2     // On board LED
#define RXD2 16
#define TXD2 17
#define ESP32_CORE_0 0
#define ESP32_CORE_1 1

extern bool serial2Lock;

// PT
unsigned int transmitCommand(unsigned char *Tx, unsigned int lenTx, unsigned char *Rx, unsigned int lenRx);
void printWifiStatus();

#endif //__CONFIG_HPP__
