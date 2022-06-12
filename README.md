# ESP32server
A Server based on ESP32 serving BLE and Web over network for ZARNITZA company
# Compile options
  1. ESP32 dev module
  2. Upload speed 921600
  3. Flash configurations:    
      * Cpu speed 240 mhz
      * Flash speed 80 mhz
      * Flash mode qio
      * Flash size 4mb
      * Partition scheme default
# Device Configuration
Device predefined variables are modifiable.
In [configuration file](./config.hpp), predifeined variable of the frimware may be  changed and rebuilt.
> [CAUTION] **DO NOT** change the reserved configuration.
## Configuration Details
* Access-Point name
  ```
  #define SSID_AP "zlab" 
  #define SSID_AP_LEN 4 
  ```
* DNS RESOLVE DOMAIN e.g http://DOMAIN.local
  ```
  #define DOMAIN "zlab"
  #define DOMAIN_LEN 4
  ```
* WebApp and server endpoints
  ```
  #define PATH_SENDCOMMAND "/api/lab/send-command"
  #define PATH_SENDCOMMAND_LEN 22
  #define PATH_SUBSCRIBE "/api/lab/subscribe"
  #define PATH_SUBSCRIBE_LEN 19
  #define PATH_SOCKET "/api/lab/subscribe"
  #define PATH_CONFIG "/config"
  #define PATH_CONFIG_LEN 7
  ```
* WEBSOCKET CYCLE

  ```
  #define CYCLE_INTERVAL 230
  ```
* Laboratory [STM] Heartbeat cycle
  ```
  #define HEARBEAT_INTERVAL 2500
  ```
* UDP server Specifications
  ```
  #define UDP_SERVER_IP "10.242.1.99"
  #define UDP_SERVER_IP_LEN 11
  #define UDP_SERVER_PORT 42
  #define UDP_SERVER_AWAIT 100
  ```
* TIMEOUT FOR LAB [STM] response
  ```
  #define TIMEOUT 20
  ```
* Buffer size for binary requests [e.g send-command, socket packets, laboratory responses]
  ```
  #define BUFFER_SIZE 2048
  ```
# Dependencies
## [Libraries](./lib) 
Install following Libraries in your ArduinoIDE according to the guide for installing library from a ZIP.
## [File System Tools](./lib/ESP32FS-1.0.zip) 
Extract copy the jar file into the path ```{ARDUINO_PATH}/tools/ESP32FS/tool```
> This tool is used for uploading the *root folder* into SPIFFS. In order upload into the file system, just follow this steps in ArduinoIDE [ tools > ESP32 Sketch Data Upload] 
