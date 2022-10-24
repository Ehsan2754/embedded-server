#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include <WiFi.h>
#include <DNSServer.h>
#include <ESPmDNS.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <SPIFFS.h>
#include "config.hpp"
#include "fileSystem.hpp"
#include "webApp.hpp"

String ssid;
String pass;
String ip;
String gateway;
String serverURL;
const char *PARAM_INPUT_1 = "ssid";
const char *PARAM_INPUT_2 = "pass";
const char *PARAM_INPUT_3 = "ip";
const char *PARAM_INPUT_4 = "gateway";
const char *PARAM_INPUT_5 = "server";
bool reset_params = false;
bool subscribeFlag = false;
TaskHandle_t socketTaskHandle = NULL;
TaskHandle_t DNSTaskHandle = NULL;
unsigned char GetSensorValues[] =  {0xaa,0x6, 0, 0x10, 0xC0, 0x31};
unsigned int LenGetSensorValues = 6;

static char socket_subscribe_str[PATH_SUBSCRIBE_LEN + SERIAL_NO_LEN];
static char domain_str[DOMAIN_LEN + SERIAL_NO_LEN];
// Create AsyncWebServer object on port 80
AsyncWebServer server(80);
//DNSServer *dnsServer = new DNSServer;
AsyncWebSocket *ws = new AsyncWebSocket(PATH_SOCKET);
const TickType_t xDelay = CYCLE_INTERVAL / portTICK_PERIOD_MS;
const TickType_t heartbeatDelay = HEARBEAT_INTERVAL / portTICK_PERIOD_MS;

class CaptiveRequestHandler : public AsyncWebHandler
{
public:
  CaptiveRequestHandler() {}
  virtual ~CaptiveRequestHandler() {}

  bool canHandle(AsyncWebServerRequest *request)
  {
    return true;
  }

  void handleRequest(AsyncWebServerRequest *request)
  {

    request->redirect(("http://" + WiFi.softAPIP().toString()).c_str());
  }
};

void handleWebSocketMessage(void *arg, uint8_t *data, size_t len)
{

}
unsigned char sensorResponse[BUFFER_SIZE];
void socketTaskRoutine(void *pvParameters)
{

  while (true)
  {
    
    auto sensorResponseLen = transmitCommand(GetSensorValues, LenGetSensorValues, sensorResponse, 100);
    if (subscribeFlag)
    {
      DEBUG_PRINTLN(DEBUG_APP "WebSocket Broadcasting data.");
      ws->binaryAll(sensorResponse, sensorResponseLen);
      vTaskDelay(xDelay);
    }
    else
    {
      DEBUG_PRINTLN(DEBUG_APP "Sending heartbeat to lab.");
      vTaskDelay(heartbeatDelay);
    }
  }
}

void onEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type,
             void *arg, uint8_t *data, size_t len)
{
  switch (type)
  {
  case WS_EVT_CONNECT:
    DEBUG_PRINTF(DEBUG_APP "WebSocket client #%u connected from %s\n", client->id(), client->remoteIP().toString().c_str());
    if (!subscribeFlag)
    {
      subscribeFlag = true;
      DEBUG_PRINTLN(DEBUG_APP "WebSocket Subscribed.");
    }
    break;
  case WS_EVT_DISCONNECT:
    DEBUG_PRINTF(DEBUG_APP "WebSocket client #%u disconnected\n", client->id());
    if (subscribeFlag)
    {
      // subscribeFlag = false;
      DEBUG_PRINTLN(DEBUG_APP "WebSocket Unsubscribed.");
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

  DEBUG_PRINTLN(DEBUG_APP "WebSocket Initialized.");
  ws->onEvent(onEvent);
  server.addHandler(ws);
  subscribeFlag = true;
  xTaskCreatePinnedToCore(socketTaskRoutine, "socketTaskRoutine", 2048, NULL, 2, &socketTaskHandle, ESP32_CORE_1);
}

void initWebAppServer()
{
  server.serveStatic("/", SPIFFS, "/");

  // Route for root / web page
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request)
            {
                DEBUG_PRINTLN(DEBUG_APP"Serving request GET /"); 
                request->send(SPIFFS, "/index.html", "text/html"); });

  server.on("/config", HTTP_GET, [](AsyncWebServerRequest *request)
            { 
                DEBUG_PRINTLN(DEBUG_APP"Serving request GET /config");
                request->send(SPIFFS, "/admin.html", "text/html"); });
  server.on("/", HTTP_POST, [](AsyncWebServerRequest *request)
            {
      int params = request->params();
      for(int i=0;i<params;i++){
        AsyncWebParameter* p = request->getParam(i);
        if(p->isPost()){
          // HTTP POST ssid value
          if (p->name() == PARAM_INPUT_1) {
            ssid = p->value().c_str();
            DEBUG_PRINT(DEBUG_APP"SSID set to: ");
            DEBUG_PRINTLN(ssid);
            // Write file to save value
            writeFile(SPIFFS, ssidPath, ssid.c_str());
          }
          // HTTP POST pass value
          if (p->name() == PARAM_INPUT_2) {
            pass = p->value().c_str();
            DEBUG_PRINT(DEBUG_APP"Password set to: ");
            DEBUG_PRINTLN(pass);
            // Write file to save value
            writeFile(SPIFFS, passPath, pass.c_str());
          }

          // HTTP POST ip value
          if (p->name() == PARAM_INPUT_3) {
            ip = p->value().c_str();
            DEBUG_PRINT(DEBUG_APP"IP Address set to: ");
            DEBUG_PRINTLN(ip);
            // Write file to save value
            writeFile(SPIFFS, ipPath, ip.c_str());
          }
          // HTTP POST gateway value
          if (p->name() == PARAM_INPUT_4) {
            gateway = p->value().c_str();
            DEBUG_PRINT(DEBUG_APP"Gateway set to: ");
            DEBUG_PRINTLN(gateway);
            // Write file to save value
            writeFile(SPIFFS, gatewayPath, gateway.c_str());
          }
          // HTTP POST serverURL value
          if (p->name() == PARAM_INPUT_5) {
            serverURL = p->value().c_str();
            DEBUG_PRINT(DEBUG_APP"Server set to: ");
            DEBUG_PRINTLN(serverURL);
            // Write file to save value
            writeFile(SPIFFS, serverPath, serverURL.c_str());
          }
          DEBUG_PRINTF("POST[%s]: %s\n", p->name().c_str(), p->value().c_str());
        }
      }
      request->send(200, "text/plain", "Done. ESP will restart, connect to your router and go to IP address: " + ip);


      // -- This is freaking insane. no sense to do this but ... 
      reset_params = true;
      // end of madness
      
      
      });
  server.on(
      PATH_SENDCOMMAND,
      HTTP_POST,
      [](AsyncWebServerRequest *request) {},
      NULL,
      [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total)
      {
        DEBUG_PRINT(DEBUG_APP "Serving request POST ");
        DEBUG_PRINTLN(PATH_SENDCOMMAND);
        unsigned char response_buffer[BUFFER_SIZE];
        unsigned int response_len = transmitCommand(data, len, response_buffer, BUFFER_SIZE);

        AsyncWebServerResponse *response = request->beginResponse_P(200, "raw/binary", response_buffer, response_len);
        response->addHeader("Content-Encoding", "binary");
        request->send(response);
      });




  DEBUG_PRINTLN(DEBUG_APP "WebApp server initialized.");
  server.begin();
}

static char ssid_ap_str[SSID_AP_LEN + SERIAL_NO_LEN];
void initWifiAP()
{
  WiFi.mode(WIFI_AP);
   sprintf(ssid_ap_str, "%s%s", obtainLabtype(), SN);
  DEBUG_PRINTLN(DEBUG_INFO "WiFi Access-Point initialized.");
  // Connect to Wi-Fi network with SSID and password
  DEBUG_PRINT(DEBUG_INFO "Setting AP (Access Point) SSID=");
  DEBUG_PRINTLN(ssid_ap_str);

  // NULL sets an open Access Point
  WiFi.softAP(ssid_ap_str,PASSWORD_AP);

  IPAddress IP = WiFi.softAPIP();
  DEBUG_PRINT(DEBUG_INFO "AP IP address: ");
  DEBUG_PRINTLN(IP);

}
