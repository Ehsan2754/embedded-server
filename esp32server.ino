#include <Arduino.h>
#include <WiFi.h>
#include <SPIFFS.h>
#include "fileSystem.hpp"
#include "webApp.hpp"
#include "config.hpp"

// Timer variables
const long interval = 10 * 1000; // interval to wait for Wi-Fi connection (milliseconds)
unsigned long previousMillis = 0;
TaskHandle_t serverTaskHandle;
IPAddress localIP;
IPAddress localGateway;
IPAddress subnet(255, 255, 0, 0);

// Initialize WiFi
bool initWiFi()
{
  WiFi.mode(WIFI_STA);
  if (ssid == "" || ip == "")
  {
    DEBUG_PRINTLN(DEBUG_INFO "Undefined SSID or IP address.");
  }
  else
  {
    localIP.fromString(ip.c_str());
    localGateway.fromString(gateway.c_str());

    if (!WiFi.config(localIP, localGateway, subnet))
    {
      DEBUG_PRINTLN(DEBUG_INFO "STA Failed to configure");
      return false;
    }
  }
  WiFi.begin(ssid.c_str(), pass.c_str());
  DEBUG_PRINTLN(DEBUG_INFO "Connecting to WiFi...");

  unsigned long currentMillis = millis();
  previousMillis = currentMillis;

  while (WiFi.status() != WL_CONNECTED)
  {
    currentMillis = millis();
    if (currentMillis - previousMillis >= interval)
    {
      DEBUG_PRINTLN(DEBUG_INFO "Failed to connect.");
      return false;
    }
  }

  DEBUG_PRINTLN(WiFi.localIP());
  return true;
}

void setup()
{
  disableCore0WDT();
  disableCore1WDT();
  Serial.begin(115200);
  Serial.setTimeout(TIMEOUT);
  Serial2.begin(115200);
  Serial2.setTimeout(TIMEOUT);
  getSerialNumber();
  initSPIFFS();

  // Set GPIO 2 as an OUTPUT
  pinMode(PIN_LED, OUTPUT);
  digitalWrite(PIN_LED, LOW);

  // Load values saved in SPIFFS
  ssid = readFile(SPIFFS, ssidPath);
  pass = readFile(SPIFFS, passPath);
  ip = readFile(SPIFFS, ipPath);
  gateway = readFile(SPIFFS, gatewayPath);
  if (ssid != "")
  {
    DEBUG_PRINTLN(DEBUG_INFO "SSID=");
    DEBUG_PRINTLN(ssid);
  }
  else
  {
    DEBUG_PRINTLN(DEBUG_INFO "No SSID!");
  }
  if (pass != "")
  {
    DEBUG_PRINT(DEBUG_INFO "PASSWORD=");
    DEBUG_PRINTLN(pass);
  }
  else
  {
    DEBUG_PRINT(DEBUG_INFO "No PASSWORD!");
  }
  if (ip != "")
  {
    DEBUG_PRINT(DEBUG_INFO "IP=");
    DEBUG_PRINTLN(ip);
  }
  else
  {
    DEBUG_PRINTLN(DEBUG_INFO "No IP!");
  }
  if (gateway != "")
  {
    DEBUG_PRINT(DEBUG_INFO "Gateway=");
    DEBUG_PRINTLN(gateway);
  }
  else
  {
    DEBUG_PRINTLN(DEBUG_INFO "No Gateway!");
  }
  if (initWiFi())
  {
    printWifiStatus();
    initWebAppServer();
    initWebSocket();
    initDNS(false);
    xTaskCreatePinnedToCore(serverConnectionHandleRoutine, "serverConnectionHandleRoutine", 4096, NULL, 3, &serverTaskHandle, ESP32_CORE_0);
  }
  else
  {
    initWifiAP();
    initDNS(true);
    // initWebSocket();
    // initWebAppServer();
    // xTaskCreatePinnedToCore(serverConnectionHandleRoutine, "serverConnectionHandleRoutine", 2048, NULL, 2, &serverTaskHandle, ESP32_CORE_1);

  }
}

void loop()
{
  // dnsServer->processNextRequest();
}
