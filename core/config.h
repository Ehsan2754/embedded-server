#ifndef __CONFIG_H__
#define __CONFIG_H__

#define SERIAL_NO "00"
#define ESP32_CORE_0 0
#define ESP32_CORE_1 1

// PIN Configuration
#define PIN_TRIGGER 0 // BOOT PIN which will reset the ssid
#define PIN_LED 2     //On board LED
#define RXD2 16
#define TXD2 17
// PT
void printWifiStatus();

#endif //__CONFIG_H__
