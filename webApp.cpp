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
static char socket_subscribe_str[PATH_SUBSCRIBE_LEN + SERIAL_NO_LEN];
static char domain_str[DOMAIN_LEN + SERIAL_NO_LEN];
AsyncWebSocket *ws;
const TickType_t xDelay = CYCLE_INTERVAL / portTICK_PERIOD_MS;

void initDNS()
{
  sprintf(domain_str, "%s%s", DOMAIN, SN);
  if (!MDNS.begin(domain_str))
  {
    DEBUG_PRINTLN("Error starting mDNS");
  }
  else
  {
    DEBUG_PRINTF("URL= http://%s.local\n", domain_str);
  }
}
void handleWebSocketMessage(void *arg, uint8_t *data, size_t len)
{
  // DEBUG_PRINTLN("Сommand sent to socket.->")
  // unsigned char response_buffer[BUFFER_SIZE];
  // unsigned int response_len = transmitCommand(data, len, response_buffer, BUFFER_SIZE);
  // ws->binaryAll(response_buffer, response_len);
  // DEBUG_PRINTLN("<-Сommand replied.")
  
}
void socketTaskRoutine(void *pvParameters)
{

  while (true)
  {
    if (!subscribeFlag)
      continue;
    DEBUG_PRINTLN("WebSocket Broadcasting data.");
    unsigned char sensorResponse[100];
    auto sensorResponseLen = transmitCommand(GetSensorValues, LenGetSensorValues, sensorResponse, 100);
    ws->binaryAll(sensorResponse, sensorResponseLen);
    vTaskDelay(xDelay);
  }
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
      DEBUG_PRINTLN("WebSocket Unsubscribed.");
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

  DEBUG_PRINTLN("WebSocket Initialized.");
  sprintf(socket_subscribe_str, "%s%s", PATH_SUBSCRIBE, SN);
  // ws.url = socket_subscribe_str;
  ws = new AsyncWebSocket(socket_subscribe_str);
  ws->onEvent(onEvent);
  server.addHandler(ws);
  subscribeFlag = true;
  xTaskCreatePinnedToCore(socketTaskRoutine, "socketTaskRoutine", 2048, NULL, 1, &socketTaskHandle, ESP32_CORE_0);
}

static char path_sendcommand_str[PATH_SENDCOMMAND_LEN + SERIAL_NO_LEN];
static char path_subscribe_str[PATH_SUBSCRIBE_LEN + SERIAL_NO_LEN];
void initWebAppServer()
{
  server.serveStatic("/config/", SPIFFS, "/config/")
      .setDefaultFile("/admin.html");

  server.serveStatic("/", SPIFFS, "/");

  // Route for root / web page
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request)
            {
                DEBUG_PRINTLN("Serving request GET /"); 
                request->send(SPIFFS, "/index.html", "text/html"); });

  server.on("/config", HTTP_GET, [](AsyncWebServerRequest *request)
            { 
                DEBUG_PRINTLN("Serving request GET /config");
                request->send(SPIFFS, "/admin.html", "text/html"); });

  sprintf(path_subscribe_str, "%s%s", PATH_SUBSCRIBE, SN);

  server.on(path_subscribe_str, HTTP_GET, [](AsyncWebServerRequest *request)
            {            DEBUG_PRINT("Serving request GET ");
            DEBUG_PRINTLN(path_subscribe_str);
                subscribeFlag=true;
                DEBUG_PRINTLN("WebSocket subscribed.");
                request->send(200); });

  sprintf(path_sendcommand_str, "%s%s", PATH_SENDCOMMAND, SN);

  server.on(
      path_sendcommand_str,
      HTTP_POST,
      [](AsyncWebServerRequest *request) {},
      NULL,
      [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total)
      {
        DEBUG_PRINT("Serving request POST ");
        DEBUG_PRINTLN(path_sendcommand_str);
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

  DEBUG_PRINTLN("WebApp server initialized.");
  server.begin();
}

static char ssid_ap_str[SSID_AP_LEN + SERIAL_NO_LEN];
void initWifiAP()
{
  sprintf(ssid_ap_str, "%s%s", SSID_AP, SN);
  DEBUG_PRINTLN("WiFi Access-Point initialized.");
  // Connect to Wi-Fi network with SSID and password
  DEBUG_PRINT("Setting AP (Access Point) SSID=");
  DEBUG_PRINTLN(ssid_ap_str);

  // NULL sets an open Access Point
  WiFi.softAP(ssid_ap_str);

  IPAddress IP = WiFi.softAPIP();
  DEBUG_PRINT("AP IP address: ");
  DEBUG_PRINTLN(IP);

  // Web Server Root URL
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send(SPIFFS, "/admin.html", "text/html"); })
      .setAuthentication(USERNAME, SN);

  server.serveStatic("/", SPIFFS, "/").setAuthentication(USERNAME, PASSWORD);

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
