
#include <Arduino.h>
#include <WiFi.h>
#include <SPIFFS.h>
#include "fileSystem.hpp"
#include "webApp.hpp"
#include "config.hpp"


// Timer variables
const long interval = 10 * 1000; // interval to wait for Wi-Fi connection (milliseconds)
unsigned long previousMillis = 0;



IPAddress localIP;
IPAddress localGateway;
IPAddress subnet(255, 255, 0, 0);



// Initialize WiFi
bool initWiFi()
{
  if (ssid == "" || ip == "")
  {
    DEBUG_PRINTLN("Undefined SSID or IP address.");
    return false;
  }

  WiFi.mode(WIFI_STA);
  localIP.fromString(ip.c_str());
  localGateway.fromString(gateway.c_str());

  if (!WiFi.config(localIP, localGateway, subnet))
  {
    DEBUG_PRINTLN("STA Failed to configure");
    return false;
  }
  WiFi.begin(ssid.c_str(), pass.c_str());
  DEBUG_PRINTLN("Connecting to WiFi...");

  unsigned long currentMillis = millis();
  previousMillis = currentMillis;

  while (WiFi.status() != WL_CONNECTED)
  {
    currentMillis = millis();
    if (currentMillis - previousMillis >= interval)
    {
      DEBUG_PRINTLN("Failed to connect.");
      return false;
    }
  }

  DEBUG_PRINTLN(WiFi.localIP());
  return true;
}



void setup()
{
  // Serial port for debugging purposes
  Serial.begin(115200);
  Serial.setTimeout(TIMEOUT);
  Serial2.begin(115200);
  Serial2.setTimeout(TIMEOUT);
  disableCore0WDT();
  initSPIFFS();

  // Set GPIO 2 as an OUTPUT
  pinMode(PIN_LED, OUTPUT);
  digitalWrite(PIN_LED, LOW);

  // Load values saved in SPIFFS
  ssid = readFile(SPIFFS, ssidPath);
  pass = readFile(SPIFFS, passPath);
  ip = readFile(SPIFFS, ipPath);
  gateway = readFile(SPIFFS, gatewayPath);
  DEBUG_PRINTLN(ssid);
  DEBUG_PRINTLN(pass);
  DEBUG_PRINTLN(ip);
  DEBUG_PRINTLN(gateway);

  if (initWiFi())
  {
    printWifiStatus();
    initDNS();
    initWebAppServer();
  }
  else
  {
    initWifiAP();
  }
}

void loop()
{
}
