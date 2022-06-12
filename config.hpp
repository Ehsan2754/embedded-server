#ifndef __CONFIG_HPP__
#define __CONFIG_HPP__

#define DEBUG
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
#define DEBUG_PRINTln(...)
#define DEBUG_PRINTf(...)
#endif




#define SERIAL_NO_LEN 8
extern char SN[SERIAL_NO_LEN];
#define SERIAL_NO "0000"
#define SSID_AP "zlab" 
#define SSID_AP_LEN 4 
#define USERNAME "admin"
#define PASSWORD SN


//IP address to send UDP data to:
// either use the ip address of the server or 
// a network broadcast address
// const char * SERVER_ADDR = "10.65.16.78";
// const IPAddress ServerIP(10,65,16,78);
// const int SERVER_PORT = 42;
#define SERVER_URL "10.242.1.99"
#define SERVER_URL_LEN 11
#define REGISTER_API ""
#define REGISTER_API_LEN 0


#define PATH_SENDCOMMAND "/api/lab/send-command"
#define PATH_SENDCOMMAND_LEN 22
#define PATH_SUBSCRIBE "/api/lab/subscribe" 
#define PATH_SUBSCRIBE_LEN 19
#define PATH_SOCKET "/api/lab/subscribe" 
#define PATH_SOCKET_LEN 15
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
uint16_t MODBUS_CRC16(const unsigned char *buf, unsigned int len);
void getSerialNumber();
void printWifiStatus();
void serverConnectionHandleRoutine(void *pvParameters);

#endif //__CONFIG_HPP__
