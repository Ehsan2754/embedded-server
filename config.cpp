#include <Arduino.h>
#include <WiFi.h>
#include <HardwareSerial.h>
#include "config.hpp"
bool serial2Lock = false;

unsigned int transmitCommand(unsigned char *Tx, unsigned int lenTx, unsigned char *Rx, unsigned int lenRx)
{
  if (serial2Lock)
  {
    DEBUG_PRINT("Waiting for device to get free.");
  }
  while (serial2Lock)
  {
    DEBUG_PRINT(".");
  }
  DEBUG_PRINTLN();
  serial2Lock = true;

  Serial2.flush();

  for (auto i = 0; i < lenTx; i++)
  {
    Serial2.write(*(Tx + i));
  }
  DEBUG_PRINT("request-packet={");
  for (auto i = 0; i < lenTx; i++)
  {
    DEBUG_PRINTF(" 0x%X ", *(Tx + i));
  }
  DEBUG_PRINT("}");
  DEBUG_PRINTLN();
  unsigned int response_len = Serial2.readBytes(Rx, lenRx);
  DEBUG_PRINT("response-packet={");
  for (auto i = 0; i < response_len; i++)
  {
    DEBUG_PRINTF(" 0x%X ", *(Rx + i));
  }
  DEBUG_PRINT("}");
  DEBUG_PRINTLN();

  serial2Lock = false;
  return response_len;
}

void printWifiStatus() {

  // print the SSID of the network you're attached to:
  DEBUG_PRINT("SSID: ");
  DEBUG_PRINTLN(WiFi.SSID());

  // print your WiFi shield's IP address:
  auto ip = WiFi.localIP();
  DEBUG_PRINT("IP Address: ");
  DEBUG_PRINTLN(ip);

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  DEBUG_PRINT("signal strength (RSSI):");
  DEBUG_PRINT(rssi);
  DEBUG_PRINTLN(" dBm");
  // print where to go in a browser:
  DEBUG_PRINT("Open http://");
  DEBUG_PRINTLN(ip);
}
