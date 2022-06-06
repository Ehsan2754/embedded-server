#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include <ESPmDNS.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <AsyncTCP.h>
#include <SPIFFS.h>
#include "config.hpp"
#include "fileSystem.hpp"
#include "webApp.hpp"

String ssid;
String pass;
String ip;
String gateway;
const char *PARAM_INPUT_1 = "ssid";
const char *PARAM_INPUT_2 = "pass";
const char *PARAM_INPUT_3 = "ip";
const char *PARAM_INPUT_4 = "gateway";

bool subscribeFlag = false;
TaskHandle_t socketTaskHandle = NULL;
unsigned char GetSensorValues[] = {170, 6, 0, 16, 192, 49};
unsigned int LenGetSensorValues = 6;

// Create AsyncWebServer object on port 80
AsyncWebServer server(80);
AsyncWebSocket ws("/ws");

const TickType_t xDelay = CYCLE_INTERVAL / portTICK_PERIOD_MS;

void initDNS()
{
    if (!MDNS.begin(DOMAIN))
    {
        DEBUG_PRINTLN("Error starting mDNS");
    }
    else
    {
        DEBUG_PRINTLN("URL= http://" DOMAIN ".local");
    }
}
void handleWebSocketMessage(void *arg, uint8_t *data, size_t len)
{
}

void onEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type,
             void *arg, uint8_t *data, size_t len)
{
    switch (type)
    {
    case WS_EVT_CONNECT:
        DEBUG_PRINTF("WebSocket client #%u connected from %s\n", client->id(), client->remoteIP().toString().c_str());
        break;
    case WS_EVT_DISCONNECT:
        DEBUG_PRINTF("WebSocket client #%u disconnected\n", client->id());
        if (subscribeFlag)
        {
            subscribeFlag = false;
        }
        if (serial2Lock)
        {
            DEBUG_PRINT("Unlocking the subscription.");
        }
        while (serial2Lock)
        {
            DEBUG_PRINT(".");
        }
        DEBUG_PRINTLN();
        if (socketTaskHandle != NULL)
        {
            vTaskDelete(socketTaskHandle);
        }
        break;
    case WS_EVT_DATA:
        handleWebSocketMessage(arg, data, len);
        break;
    case WS_EVT_PONG:
    case WS_EVT_ERROR:
        break;
    }
}

void initWebSocket()
{
    ws.onEvent(onEvent);
    server.addHandler(&ws);
}
void socketTaskRoutine(void *pvParameters)
{
    initWebSocket();
    unsigned char sensorResponse[100];
    while (subscribeFlag)
    {

        auto sensorResponseLen = transmitCommand(GetSensorValues, LenGetSensorValues, sensorResponse, 100);
        ws.binaryAll(sensorResponse, sensorResponseLen);
        vTaskDelay(xDelay);
    }
}

void initWebAppServer()
{
    // Route for root / web page
    server.on("/", HTTP_GET, [](AsyncWebServerRequest *request)
              { request->send(SPIFFS, "/index.html", "text/html"); });
    server.on("/config", HTTP_GET, [](AsyncWebServerRequest *request)
              { request->send(SPIFFS, "/admin.html", "text/html"); });
    server.on(PATH_SUBSCRIBE, HTTP_GET, [](AsyncWebServerRequest *request)
              { 
                subscribeFlag=true;
                socketTaskHandle = NULL;
                xTaskCreatePinnedToCore(socketTaskRoutine, "socketTaskRoutine", 2048, NULL, 1, &socketTaskHandle,ESP32_CORE_0);
                request->send(200); });
    server.on(
        PATH_SENDCOMMAND,
        HTTP_POST,
        [](AsyncWebServerRequest *request) {},
        NULL,
        [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total)
        {
            unsigned char response_buffer[BUFFER_SIZE];
            unsigned int response_len = transmitCommand(data, len, response_buffer, BUFFER_SIZE);

            AsyncWebServerResponse *response = request->beginResponse_P(200, "raw/binary", response_buffer, response_len);
            response->addHeader("Content-Encoding", "binary");
            request->send(response);
        });

    server.on("/config", HTTP_POST, [](AsyncWebServerRequest *request)
              {
      int params = request->params();
      for(int i=0;i<params;i++){
        AsyncWebParameter* p = request->getParam(i);
        if(p->isPost()){
          // HTTP POST ssid value
          if (p->name() == PARAM_INPUT_1) {
            ssid = p->value().c_str();
            DEBUG_PRINT("SSID set to: ");
            DEBUG_PRINTLN(ssid);
            // Write file to save value
            writeFile(SPIFFS, ssidPath, ssid.c_str());
          }
          // HTTP POST pass value
          if (p->name() == PARAM_INPUT_2) {
            pass = p->value().c_str();
            DEBUG_PRINT("Password set to: ");
            DEBUG_PRINTLN(pass);
            // Write file to save value
            writeFile(SPIFFS, passPath, pass.c_str());
          }
          // HTTP POST ip value
          if (p->name() == PARAM_INPUT_3) {
            ip = p->value().c_str();
            DEBUG_PRINT("IP Address set to: ");
            DEBUG_PRINTLN(ip);
            // Write file to save value
            writeFile(SPIFFS, ipPath, ip.c_str());
          }
          // HTTP POST gateway value
          if (p->name() == PARAM_INPUT_4) {
            gateway = p->value().c_str();
            DEBUG_PRINT("Gateway set to: ");
            DEBUG_PRINTLN(gateway);
            // Write file to save value
            writeFile(SPIFFS, gatewayPath, gateway.c_str());
          }
          //DEBUG_PRINTF("POST[%s]: %s\n", p->name().c_str(), p->value().c_str());
        }
      }
      request->send(200, "text/plain", "Done. ESP will restart, connect to your router and go to IP address: " + ip);
      delay(3000);
      ESP.restart(); });
    server.serveStatic("/", SPIFFS, "/");

    server.begin();
}

void initWifiAP()
{
    // Connect to Wi-Fi network with SSID and password
    DEBUG_PRINTLN("Setting AP (Access Point) SSID=" SSID_AP);
    // NULL sets an open Access Point
    WiFi.softAP(SSID_AP, SSID_PASS);

    IPAddress IP = WiFi.softAPIP();
    DEBUG_PRINT("AP IP address: ");
    DEBUG_PRINTLN(IP);

    // Web Server Root URL
    server.on("/", HTTP_GET, [](AsyncWebServerRequest *request)
              { request->send(SPIFFS, "/admin.html", "text/html"); });

    server.serveStatic("/", SPIFFS, "/");

    server.on("/", HTTP_POST, [](AsyncWebServerRequest *request)
              {
      int params = request->params();
      for(int i=0;i<params;i++){
        AsyncWebParameter* p = request->getParam(i);
        if(p->isPost()){
          // HTTP POST ssid value
          if (p->name() == PARAM_INPUT_1) {
            ssid = p->value().c_str();
            DEBUG_PRINT("SSID set to: ");
            DEBUG_PRINTLN(ssid);
            // Write file to save value
            writeFile(SPIFFS, ssidPath, ssid.c_str());
          }
          // HTTP POST pass value
          if (p->name() == PARAM_INPUT_2) {
            pass = p->value().c_str();
            DEBUG_PRINT("Password set to: ");
            DEBUG_PRINTLN(pass);
            // Write file to save value
            writeFile(SPIFFS, passPath, pass.c_str());
          }
          // HTTP POST ip value
          if (p->name() == PARAM_INPUT_3) {
            ip = p->value().c_str();
            DEBUG_PRINT("IP Address set to: ");
            DEBUG_PRINTLN(ip);
            // Write file to save value
            writeFile(SPIFFS, ipPath, ip.c_str());
          }
          // HTTP POST gateway value
          if (p->name() == PARAM_INPUT_4) {
            gateway = p->value().c_str();
            DEBUG_PRINT("Gateway set to: ");
            DEBUG_PRINTLN(gateway);
            // Write file to save value
            writeFile(SPIFFS, gatewayPath, gateway.c_str());
          }
          //DEBUG_PRINTF("POST[%s]: %s\n", p->name().c_str(), p->value().c_str());
        }
      }
      request->send(200, "text/plain", "Done. ESP will restart, connect to your router and go to IP address: " + ip);
      delay(3000);
      ESP.restart(); });
    server.begin();
}
