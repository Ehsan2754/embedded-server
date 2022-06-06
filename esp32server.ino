
#include <Arduino.h>
#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <AsyncTCP.h>
#include <SPIFFS.h>
#include "config.hpp"
// Create AsyncWebServer object on port 80
AsyncWebServer server(80);
AsyncWebSocket ws("/");

// Search for parameter in HTTP POST request
const char *PARAM_INPUT_1 = "ssid";
const char *PARAM_INPUT_2 = "pass";
const char *PARAM_INPUT_3 = "ip";
const char *PARAM_INPUT_4 = "gateway";

// Variables to save values from HTML form
String ssid;
String pass;
String ip;
String gateway;

// File paths to save input values permanently
const char *ssidPath = "/wifi/ssid.txt";
const char *passPath = "/wifi/pass.txt";
const char *ipPath = "/wifi/ip.txt";
const char *gatewayPath = "/wifi/gateway.txt";

IPAddress localIP;
// IPAddress localIP(192, 168, 1, 200); // hardcoded

// Set your Gateway IP address
IPAddress localGateway;
// IPAddress localGateway(192, 168, 1, 1); //hardcoded
IPAddress subnet(255, 255, 0, 0);

// Timer variables
unsigned long previousMillis = 0;

// Set LED GPIO

// Stores LED state

String ledState;
TaskHandle_t socketTaskHandle = NULL;
bool subscribeFlag = false;
bool serial2Lock = false;
// Initialize SPIFFS
void initSPIFFS()
{
  if (!SPIFFS.begin(true))
  {
    Serial.println("An error has occurred while mounting SPIFFS");
  }
  Serial.println("SPIFFS mounted successfully");
}

// Read File from SPIFFS
String readFile(fs::FS &fs, const char *path)
{
  Serial.printf("Reading file: %s\r\n", path);

  File file = fs.open(path);
  if (!file || file.isDirectory())
  {
    Serial.println("- failed to open file for reading");
    return String();
  }

  String fileContent;
  while (file.available())
  {
    fileContent = file.readStringUntil('\n');
    break;
  }
  return fileContent;
}

// Write file to SPIFFS
void writeFile(fs::FS &fs, const char *path, const char *message)
{
  Serial.printf("Writing file: %s\r\n", path);

  File file = fs.open(path, FILE_WRITE);
  if (!file)
  {
    Serial.println("- failed to open file for writing");
    return;
  }
  if (file.print(message))
  {
    Serial.println("- file written");
  }
  else
  {
    Serial.println("- frite failed");
  }
}
// Initialize WiFi
bool initWiFi()
{
  if (ssid == "" || ip == "")
  {
    Serial.println("Undefined SSID or IP address.");
    return false;
  }

  WiFi.mode(WIFI_STA);
  localIP.fromString(ip.c_str());
  localGateway.fromString(gateway.c_str());

  if (!WiFi.config(localIP, localGateway, subnet))
  {
    Serial.println("STA Failed to configure");
    return false;
  }
  WiFi.begin(ssid.c_str(), pass.c_str());
  Serial.println("Connecting to WiFi...");

  unsigned long currentMillis = millis();
  previousMillis = currentMillis;

  while (WiFi.status() != WL_CONNECTED)
  {
    currentMillis = millis();
    if (currentMillis - previousMillis >= interval)
    {
      Serial.println("Failed to connect.");
      return false;
    }
  }

  Serial.println(WiFi.localIP());
  return true;
}

// Replaces placeholder with LED state value
String processor(const String &var)
{
  if (var == "STATE")
  {
    if (digitalRead(PIN_LED))
    {
      ledState = "ON";
    }
    else
    {
      ledState = "OFF";
    }
    return ledState;
  }
  return String();
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
    Serial.printf("WebSocket client #%u connected from %s\n", client->id(), client->remoteIP().toString().c_str());
    break;
  case WS_EVT_DISCONNECT:
    Serial.printf("WebSocket client #%u disconnected\n", client->id());
    if (subscribeFlag)
    {
      subscribeFlag = false;
    }
    if (serial2Lock)
    {
      Serial.print("Unlocking the subscription.");
    }
    while (serial2Lock)
    {
      Serial.print(".");
    }
    Serial.println();
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

unsigned int transmitCommand(unsigned char *Tx, unsigned int lenTx, unsigned char *Rx, unsigned int lenRx)
{
  if (serial2Lock)
  {
    Serial.print("Waiting for device to get free.");
  }
  while (serial2Lock)
  {
    Serial.print(".");
  }
  Serial.println();
  serial2Lock = true;

  Serial2.flush();

  for (auto i = 0; i < lenTx; i++)
  {
    Serial2.write(*(Tx + i));
  }
  Serial.print("request-packet={");
  for (auto i = 0; i < lenTx; i++)
  {
    Serial.printf(" 0x%X ", *(Tx + i));
  }
  Serial.print("}");
  Serial.println();
  unsigned int response_len = Serial2.readBytes(Rx, lenRx);
  Serial.print("response-packet={");
  for (auto i = 0; i < response_len; i++)
  {
    Serial.printf(" 0x%X ", *(Rx + i));
  }
  Serial.print("}");
  Serial.println();

  serial2Lock = false;
  return response_len;
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
      
    previousMillis = millis();
    auto sensorResponseLen = transmitCommand(GetSensorValues, LenGetSensorValues, sensorResponse, 100);
    ws.binaryAll(sensorResponse, sensorResponseLen);

    while (millis() - previousMillis >= 250)
    {
//      currentMillis = millis();
    }
    // while (WiFi.status() != WL_CONNECTED)
    // {
    //   currentMillis = millis();
    //   {
    //     Serial.println("Failed to connect.");
    //     return false;
    //   }
    // }
  }
}
void setup()
{
  // Serial port for debugging purposes
  Serial.begin(115200);
  Serial1.setTimeout(TIMEOUT);
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
  Serial.println(ssid);
  Serial.println(pass);
  Serial.println(ip);
  Serial.println(gateway);

  if (initWiFi())
  {
    // Route for root / web page
    server.on("/", HTTP_GET, [](AsyncWebServerRequest *request)
              { request->send(SPIFFS, "/index.html", "text/html", false, processor); });
    server.on("/config", HTTP_GET, [](AsyncWebServerRequest *request)
              { request->send(SPIFFS, "/admin.html", "text/html", false, processor); });
    server.on(PATH_SUBSCRIBE, HTTP_GET, [](AsyncWebServerRequest *request)
              { 
                subscribeFlag=true;
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
            Serial.print("SSID set to: ");
            Serial.println(ssid);
            // Write file to save value
            writeFile(SPIFFS, ssidPath, ssid.c_str());
          }
          // HTTP POST pass value
          if (p->name() == PARAM_INPUT_2) {
            pass = p->value().c_str();
            Serial.print("Password set to: ");
            Serial.println(pass);
            // Write file to save value
            writeFile(SPIFFS, passPath, pass.c_str());
          }
          // HTTP POST ip value
          if (p->name() == PARAM_INPUT_3) {
            ip = p->value().c_str();
            Serial.print("IP Address set to: ");
            Serial.println(ip);
            // Write file to save value
            writeFile(SPIFFS, ipPath, ip.c_str());
          }
          // HTTP POST gateway value
          if (p->name() == PARAM_INPUT_4) {
            gateway = p->value().c_str();
            Serial.print("Gateway set to: ");
            Serial.println(gateway);
            // Write file to save value
            writeFile(SPIFFS, gatewayPath, gateway.c_str());
          }
          //Serial.printf("POST[%s]: %s\n", p->name().c_str(), p->value().c_str());
        }
      }
      request->send(200, "text/plain", "Done. ESP will restart, connect to your router and go to IP address: " + ip);
      delay(3000);
      ESP.restart(); });
    server.serveStatic("/", SPIFFS, "/");

    server.begin();
  }
  else
  {
    // Connect to Wi-Fi network with SSID and password
    Serial.println("Setting AP (Access Point) SSID=" SSID_AP);
    // NULL sets an open Access Point
    WiFi.softAP(SSID_AP, SSID_PASS);

    IPAddress IP = WiFi.softAPIP();
    Serial.print("AP IP address: ");
    Serial.println(IP);

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
            Serial.print("SSID set to: ");
            Serial.println(ssid);
            // Write file to save value
            writeFile(SPIFFS, ssidPath, ssid.c_str());
          }
          // HTTP POST pass value
          if (p->name() == PARAM_INPUT_2) {
            pass = p->value().c_str();
            Serial.print("Password set to: ");
            Serial.println(pass);
            // Write file to save value
            writeFile(SPIFFS, passPath, pass.c_str());
          }
          // HTTP POST ip value
          if (p->name() == PARAM_INPUT_3) {
            ip = p->value().c_str();
            Serial.print("IP Address set to: ");
            Serial.println(ip);
            // Write file to save value
            writeFile(SPIFFS, ipPath, ip.c_str());
          }
          // HTTP POST gateway value
          if (p->name() == PARAM_INPUT_4) {
            gateway = p->value().c_str();
            Serial.print("Gateway set to: ");
            Serial.println(gateway);
            // Write file to save value
            writeFile(SPIFFS, gatewayPath, gateway.c_str());
          }
          //Serial.printf("POST[%s]: %s\n", p->name().c_str(), p->value().c_str());
        }
      }
      request->send(200, "text/plain", "Done. ESP will restart, connect to your router and go to IP address: " + ip);
      delay(3000);
      ESP.restart(); });
    server.begin();
  }
}

void loop()
{
}
