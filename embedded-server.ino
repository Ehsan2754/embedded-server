#include <WiFi.h>
#include <SPIFFS.h>
#include "fileSystem.hpp"
#include "webApp.hpp"
#include "bt.hpp"
#include "config.hpp"

// Timer variables
const long interval = 10 * 1000;    // interval to wait for Wi-Fi connection (milliseconds)
const long BLEinterval = 90 * 1000; // interval to wait for BLE connection (milliseconds)
unsigned long previousMillis = 0;
TaskHandle_t serverTaskHandle;
TaskHandle_t btTaskHandle;
IPAddress localIP;
IPAddress localGateway;
IPAddress subnet(255, 255, 0, 0);
bool wifiFlag = false;
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

    mutex = xSemaphoreCreateMutex();
    disableCore0WDT();
    disableCore1WDT();
    Serial.begin(115200);
    Serial.setTimeout(TIMEOUT);
    LAB_SERIAL.begin(LAB_BAUDRATE);
    LAB_SERIAL.setTimeout(TIMEOUT);
    getSerialNumber();

    pinMode(PIN_LED, OUTPUT);
    digitalWrite(PIN_LED, LOW);

    pinMode(PIN_TRIGGER, INPUT);

    auto bState = digitalRead(PIN_TRIGGER);
    delay(50);
    bState += digitalRead(PIN_TRIGGER);
    if (bState == 2 && (!wifiFlag))
    {
        digitalWrite(PIN_LED, LOW);
        delay(100);
        digitalWrite(PIN_LED, HIGH);
        delay(100);
        digitalWrite(PIN_LED, LOW);
        delay(100);
        digitalWrite(PIN_LED, HIGH);
        delay(100);
        digitalWrite(PIN_LED, LOW);

        initBT();
    }
    else
    {
        wifiFlag = true;
        digitalWrite(PIN_LED, LOW);
        delay(100);
        digitalWrite(PIN_LED, HIGH);
        delay(100);
        digitalWrite(PIN_LED, LOW);
        delay(100);
        digitalWrite(PIN_LED, HIGH);
        delay(100);
        digitalWrite(PIN_LED, LOW);
        delay(100);
        digitalWrite(PIN_LED, HIGH);
        initSPIFFS();
        // Load values saved in SPIFFS
        ssid = readFile(SPIFFS, ssidPath);
        pass = readFile(SPIFFS, passPath);
        ip = readFile(SPIFFS, ipPath);
        gateway = readFile(SPIFFS, gatewayPath);
        serverURL = readFile(SPIFFS, serverPath);
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
        if (serverURL != "")
        {
            DEBUG_PRINT(DEBUG_INFO "serverURL=");
            DEBUG_PRINTLN(serverURL);
        }
        else
        {
            DEBUG_PRINTLN(DEBUG_INFO "No Server URL!");
        }
        if (initWiFi())
        {

            printWifiStatus();
            xTaskCreatePinnedToCore(serverConnectionHandleRoutine, "serverConnectionHandleRoutine", 4096, NULL, 3, &serverTaskHandle, ESP32_CORE_0);
        }
        else
        {
            initWifiAP();
            initWebAppServer();
            initWebSocket();
        }
    }
}
const TickType_t xDelay = 5000 / portTICK_PERIOD_MS;
void loop()
{
    if ((!digitalRead(PIN_TRIGGER)) || reset_params)
    {
        vTaskDelay(xDelay);
        if ((!digitalRead(PIN_TRIGGER)) || reset_params)
        {
            DEBUG_PRINTLN("Triggered");
            if(reset_params)
            {
            reset_params = false;
            }
            else
            {
            writeFile(SPIFFS, ssidPath, "github.com/ehsan2754");
            writeFile(SPIFFS, passPath, "github.com/ehsan2754");
            writeFile(SPIFFS, ipPath, " ");
            writeFile(SPIFFS, gatewayPath, " ");
            writeFile(SPIFFS, serverPath, "8.8.8.8");
            DEBUG_PRINTLN("Device Configuration Factory Reset");
            }
            digitalWrite(PIN_LED, LOW);
            delay(100);
            digitalWrite(PIN_LED, HIGH);
            delay(100);
            digitalWrite(PIN_LED, LOW);
            delay(100);
            digitalWrite(PIN_LED, HIGH);
            delay(100);
            digitalWrite(PIN_LED, LOW);
            delay(100);
            digitalWrite(PIN_LED, HIGH);
            initSPIFFS();
            // Load values saved in SPIFFS
            ssid = readFile(SPIFFS, ssidPath);
            pass = readFile(SPIFFS, passPath);
            ip = readFile(SPIFFS, ipPath);
            gateway = readFile(SPIFFS, gatewayPath);
            serverURL = readFile(SPIFFS, serverPath);
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
            if (serverURL != "")
            {
                DEBUG_PRINT(DEBUG_INFO "serverURL=");
                DEBUG_PRINTLN(serverURL);
            }
            else
            {
                DEBUG_PRINTLN(DEBUG_INFO "No Server URL!");
            }
            if (initWiFi())
            {

                printWifiStatus();
                xTaskCreatePinnedToCore(serverConnectionHandleRoutine, "serverConnectionHandleRoutine", 4096, NULL, 3, &serverTaskHandle, ESP32_CORE_0);
            }
            else
            {
                initWifiAP();
                initWebAppServer();
                initWebSocket();
            }
        }
    }
}
