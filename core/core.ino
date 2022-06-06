#include <WiFiManager.h>
#include "config.h"
#include "WiFiAP.h"
#include "webAPP.h"
#include "protocol.h"
TaskHandle_t WifiAP;
TaskHandle_t WebAPP;
uint8_t RxP[38];
void setup()
{
  WiFi.mode(WIFI_STA); // explicitly set mode, esp defaults to STA+AP
  Serial.begin(115200);
  Serial.setDebugOutput(true);

  Serial2.begin(115200, SERIAL_8N1, RXD2, TXD2);

  delay(3000);

  WifiAP_setup();
  disableCore0WDT();
  // disableCore1WDT();
  webAPP_setup();
  printWifiStatus();
  xTaskCreatePinnedToCore(
      WifiAP_loop,   /* Task function. */
      "WifiAP",      /* name of task. */
      10000,         /* Stack size of task */
      NULL,          /* parameter of the task */
      1,             /* priority of the task */
      &WifiAP,       /* Task handle to keep track of created task */
      ESP32_CORE_1); /* pin task to core 0 */
  delay(500);
  // xTaskCreatePinnedToCore(
  //     webAPP_loop, /* Task function. */
  //     "WebAPP",    /* name of task. */
  //     10000,          /* Stack size of task */
  //     NULL,           /* parameter of the task */
  //     1,              /* priority of the task */
  //     &WebAPP,     /* Task handle to keep track of created task */
  //     ESP32_CORE_0);  /* pin task to core 0 */
  // delay(500);
}
void loop()
{
  // delay(1000);
  // uint8_t data[2] = {0x06, 0x00};

  // auto res = send_REQ(0xAA, cmd_getInfo, data, 6, RxP, 38);
  // Serial2.println("HELLO SERIAL2");
  // for (uint16_t i = 0; i < 38; i++)
  // {
  //   Serial.write(RxP[i]);
  // }
  
}
