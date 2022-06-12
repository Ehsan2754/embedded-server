#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
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
const char *PARAM_INPUT_1 = "ssid";
const char *PARAM_INPUT_2 = "pass";
const char *PARAM_INPUT_3 = "ip";
const char *PARAM_INPUT_4 = "gateway";

bool subscribeFlag = false;
TaskHandle_t socketTaskHandle = NULL;
TaskHandle_t DNSTaskHandle = NULL;
unsigned char GetSensorValues[] = {170, 6, 0, 16, 192, 49};
unsigned int LenGetSensorValues = 6;

static char socket_subscribe_str[PATH_SUBSCRIBE_LEN + SERIAL_NO_LEN];
static char domain_str[DOMAIN_LEN + SERIAL_NO_LEN];
// Create AsyncWebServer object on port 80
AsyncWebServer server(80);
DNSServer *dnsServer = new DNSServer;
AsyncWebSocket *ws = new AsyncWebSocket(PATH_SOCKET);
const TickType_t xDelay = CYCLE_INTERVAL / portTICK_PERIOD_MS;
const TickType_t heartbeatDelay = CYCLE_INTERVAL * 100 / portTICK_PERIOD_MS;

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

void DNSTaskRoutine(void *pvParameters)
{
  DEBUG_PRINTLN(DEBUG_INFO "DNS server handling requests.");
  for (;;)
  {
    dnsServer->processNextRequest();
  }
}
void initDNS(bool ap)
{

  DEBUG_PRINTLN(DEBUG_INFO "Starting DNS");
  if (ap)
  {
    dnsServer = new DNSServer;
    dnsServer->start(53, "*", WiFi.softAPIP());
    if (!MDNS.begin(DOMAIN))
    {
      DEBUG_PRINTLN("Error setting up MDNS responder!");
    }
    else
    {
      DEBUG_PRINTLN("mDNS responder started URL = http://" DOMAIN ".local/");
      // Add service to MDNS-SD
      MDNS.addService("http", "tcp", 80);
    }
  }
  else
  {
    dnsServer = new DNSServer;
    dnsServer->start(53, "zlab.local", WiFi.localIP());
    if (!MDNS.begin(DOMAIN))
    {
      DEBUG_PRINTLN("Error setting up MDNS responder!");
    }
    else
    {
      DEBUG_PRINTLN("mDNS responder started URL = http://" DOMAIN ".local/");
      // Add service to MDNS-SD
      MDNS.addService("http", "tcp", 80);
    }
  }
  xTaskCreatePinnedToCore(DNSTaskRoutine, "DNSTaskRoutine", 2048, NULL,2, &DNSTaskHandle, ESP32_CORE_0);
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
    unsigned char sensorResponse[100];
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
      subscribeFlag = false;
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
  // sprintf(socket_subscribe_str, "%s%s", PATH_SUBSCRIBE, SN);
  // ws.url = socket_subscribe_str;
  //  ws = new AsyncWebSocket(PATH_SUBSCRIBE);
  ws->onEvent(onEvent);
  server.addHandler(ws);
  subscribeFlag = true;
  xTaskCreatePinnedToCore(socketTaskRoutine, "socketTaskRoutine", 2048, NULL, 1, &socketTaskHandle, ESP32_CORE_1);
}

// static char path_sendcommand_str[PATH_SENDCOMMAND_LEN + SERIAL_NO_LEN];
// static char path_subscribe_str[PATH_SUBSCRIBE_LEN + SERIAL_NO_LEN];
void initWebAppServer()
{
  server.serveStatic("/config/", SPIFFS, "/config/")
      .setDefaultFile("/admin.html");

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

  // sprintf(path_subscribe_str, "%s%s", PATH_SUBSCRIBE, SN);

  // server.on(PATH_SUBSCRIBE, HTTP_GET, [](AsyncWebServerRequest *request)
  //           {            DEBUG_PRINT(DEBUG_APP"Serving request GET ");
  //           DEBUG_PRINTLN(PATH_SUBSCRIBE);
  //               subscribeFlag=true;
  //               DEBUG_PRINTLN(DEBUG_APP"WebSocket subscribed.");
  //               request->send(200); });

  // sprintf(path_sendcommand_str, "%s%s", PATH_SENDCOMMAND, SN);

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

  server.on("/config", HTTP_POST, [](AsyncWebServerRequest *request)
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
          //DEBUG_PRINTF("POST[%s]: %s\n", p->name().c_str(), p->value().c_str());
        }
      }
      request->send(200, "text/plain", "Done. ESP will restart, connect to your router and go to IP address: " + ip);
      delay(30000);
      ESP.restart(); });
  // server.onNotFound([](AsyncWebServerRequest *request)
  //                   {
  //                     DEBUG_PRINT(DEBUG_APP "NOT FOUND REQUEST!");
  //                     DEBUG_PRINTLN(request->url());
  // if(request->url()!="/dashboard" ||
  // request->url()!=PATH_SENDCOMMAND||
  // request->url()!=PATH_SUBSCRIBE||
  // request->url()!="/config"||
  // request->url()!="/"
  // )
  // {request->send(SPIFFS, "/404.html", "text/html"); }
  // });

  DEBUG_PRINTLN(DEBUG_APP "WebApp server initialized.");
  server.begin();
}

// static char ssid_ap_str[SSID_AP_LEN + SERIAL_NO_LEN];
void initWifiAP()
{
  //  sprintf(ssid_ap_str, "%s%s", SSID_AP, SN);
  DEBUG_PRINTLN(DEBUG_INFO "WiFi Access-Point initialized.");
  // Connect to Wi-Fi network with SSID and password
  DEBUG_PRINT(DEBUG_INFO "Setting AP (Access Point) SSID=");
  DEBUG_PRINTLN(SSID_AP);

  // NULL sets an open Access Point
  WiFi.softAP(SSID_AP);

  IPAddress IP = WiFi.softAPIP();
  DEBUG_PRINT(DEBUG_INFO "AP IP address: ");
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
        // HTTP POST ssid value
        if(p->isPost()){
          if (p->name() == PARAM_INPUT_1) {
            ssid = p->value().c_str();
            DEBUG_PRINT(DEBUG_INFO"SSID set to: ");
            DEBUG_PRINTLN(ssid);
            // Write file to save value
            writeFile(SPIFFS, ssidPath, ssid.c_str());
          }
          // HTTP POST pass value
          if (p->name() == PARAM_INPUT_2) {
            pass = p->value().c_str();
            DEBUG_PRINT(DEBUG_INFO"Password set to: ");
            DEBUG_PRINTLN(pass);
            // Write file to save value
            writeFile(SPIFFS, passPath, pass.c_str());
          }
          // HTTP POST ip value
          if (p->name() == PARAM_INPUT_3) {
            ip = p->value().c_str();
            DEBUG_PRINT(DEBUG_INFO"IP Address set to: ");
            DEBUG_PRINTLN(ip);
            // Write file to save value
            writeFile(SPIFFS, ipPath, ip.c_str());
          }
          // HTTP POST gateway value
          if (p->name() == PARAM_INPUT_4) {
            gateway = p->value().c_str();
            DEBUG_PRINT(DEBUG_INFO"Gateway set to: ");
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

  server.onNotFound([](AsyncWebServerRequest *request)
                    {
                      DEBUG_PRINT(DEBUG_APP "NOT FOUND REQUEST!");
                      DEBUG_PRINTLN(request->url());
  if(request->url()!="/dashboard" ||
  request->url()!=PATH_SENDCOMMAND||
  request->url()!=PATH_SUBSCRIBE||
  request->url()!="/config"||
  request->url()!="/"
  )
  {request->send(SPIFFS, "/404.html", "text/html"); } });
  server.addHandler(new CaptiveRequestHandler()).setFilter(ON_AP_FILTER); // only when requested from AP
  server.begin();
}
