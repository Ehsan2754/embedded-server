#ifndef __CONFIG_HPP__
#define __CONFIG_HPP__


// Access-Point name
#define SSID_AP "zlab"
#define SSID_AP_LEN 4

// DNS RESOLVE DOMAIN e.g http://DOMAIN.local
#define DOMAIN "zlab"
#define DOMAIN_LEN 4

// WebApp and server endpoints
#define PATH_SENDCOMMAND "/api/lab/send-command"
#define PATH_SENDCOMMAND_LEN 22
#define PATH_SUBSCRIBE "/api/lab/subscribe"
#define PATH_SUBSCRIBE_LEN 19
#define PATH_SOCKET "/api/lab/subscribe"
#define PATH_CONFIG "/config"
#define PATH_CONFIG_LEN 7

// WEBSOCKET CYCLE
#define CYCLE_INTERVAL 100
// Laboratory [STM] Heartbeat cycle
#define HEARBEAT_INTERVAL 2500

// UDP server Specifications
#define UDP_SERVER_IP "62.113.104.145"
#define UDP_SERVER_IP_LEN 14
#define UDP_SERVER_PORT 5001
#define UDP_SERVER_AWAIT 1

// TIMEOUT FOR LAB [STM] response
#define TIMEOUT 100
// Buffer size for binary requests [e.g send-command, socket packets, laboratory responses]
#define BUFFER_SIZE 4096

// RESERVED
extern SemaphoreHandle_t mutex;
// DEBUG TOOLS
//#define DEBUG
#ifdef DEBUG
#define DEBUG_PRINT(...) Serial.print(__VA_ARGS__)
#define DEBUG_PRINTLN(...) Serial.println(__VA_ARGS__)
#define DEBUG_PRINTF(...) Serial.printf(__VA_ARGS__)
#define DEBUG_SERVER "[SERVER LOG]::"
#define DEBUG_LAB "[LAB LOG]::"
#define DEBUG_APP "[APP LOG]::"
#define DEBUG_INFO "[INFO LOG]::"
#else
#define DEBUG_PRINT(...)
#define DEBUG_PRINTLN(...)
#define DEBUG_PRINTF(...)
#define DEBUG_SERVER 
#define DEBUG_LAB 
#define DEBUG_APP 
#define DEBUG_INFO
#endif

// Laboratory Lock [STM Serial Lock]
extern bool serial2Lock;

#define ESP32_CORE_0 0
#define ESP32_CORE_1 1

#define SERIAL_NO_LEN 8
extern char SN[SERIAL_NO_LEN];
#define SERIAL_NO "0000"
#define USERNAME "admin"
#define PASSWORD SN
// PIN Configuration
#define PIN_TRIGGER 0 // BOOT PIN which will reset the ssid
#define PIN_LED 2     // On board LED
// Labortory[STM] Serial Pins
#define RXD2 16
#define TXD2 17
// PT
unsigned int transmitCommand(unsigned char *Tx, unsigned int lenTx, unsigned char *Rx, unsigned int lenRx);
uint16_t MODBUS_CRC16(const unsigned char *buf, unsigned int len);
void getSerialNumber();
void printWifiStatus();
void serverConnectionHandleRoutine(void *pvParameters);

#endif //__CONFIG_HPP__
