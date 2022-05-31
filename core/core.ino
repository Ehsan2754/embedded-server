#include "WiFiManager.h"
#include "config.h"
#include "WiFiAP.h"
#include "webServer.h"

TaskHandle_t WifiAP;
TaskHandle_t WebServer;
void setup(){
  WiFi.mode(WIFI_STA); // explicitly set mode, esp defaults to STA+AP  
  Serial.begin(115200);
  Serial.setDebugOutput(true);  
  delay(3000);

  
  WifiAP_setup();
  disableCore0WDT();
  // disableCore1WDT();
  webServer_setup();
  printWifiStatus();
  xTaskCreatePinnedToCore(
                    WifiAP_loop,   /* Task function. */
                    "WifiAP",     /* name of task. */
                    10000,       /* Stack size of task */
                    NULL,        /* parameter of the task */
                    1,           /* priority of the task */
                    &WifiAP,      /* Task handle to keep track of created task */
                    ESP32_CORE_1);          /* pin task to core 0 */                  
  delay(500); 
  xTaskCreatePinnedToCore(
                    webServer_loop,   /* Task function. */
                    "WebServer",     /* name of task. */
                    10000,       /* Stack size of task */
                    NULL,        /* parameter of the task */
                    1,           /* priority of the task */
                    &WebServer,      /* Task handle to keep track of created task */
                    ESP32_CORE_0);          /* pin task to core 0 */                  
  delay(500); 
}
void loop(){
 
}



