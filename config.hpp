#ifndef __CONFIG_H__
#define __CONFIG_H__

#define SERIAL_NO "lab"
#define ESP32_CORE_0 0
#define ESP32_CORE_1 1
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


const long interval = 10 * 1000; // interval to wait for Wi-Fi connection (milliseconds)
unsigned char GetSensorValues[] = {170, 6, 0, 16, 192, 49};
unsigned int LenGetSensorValues = 6;
// PT

#endif //__CONFIG_H__
