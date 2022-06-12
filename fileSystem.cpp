#include <SPIFFS.h>
#include "fileSystem.hpp"
#include "config.hpp"

const char *ssidPath = PATH_CONFIG "/ssid.txt";
const char *passPath = PATH_CONFIG "/pass.txt";
const char *ipPath = PATH_CONFIG "/ip.txt";
const char *gatewayPath = PATH_CONFIG "/gateway.txt";

// Initialize SPIFFS
void initSPIFFS()
{
    if (!SPIFFS.begin(true))
    {
        DEBUG_PRINTLN("An error has occurred while mounting SPIFFS");
    }
    DEBUG_PRINTLN("SPIFFS mounted successfully");
}
// Read File from SPIFFS
String readFile(fs::FS &fs, const char *path)
{
    DEBUG_PRINTF("Reading file: %s\r\n", path);

    File file = fs.open(path);
    if (!file || file.isDirectory())
    {
        DEBUG_PRINTLN("- failed to open file for reading");
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
    DEBUG_PRINTF("Writing file: %s\r\n", path);

    File file = fs.open(path, FILE_WRITE);
    if (!file)
    {
        DEBUG_PRINTLN("- failed to open file for writing");
        return;
    }
    if (file.print(message))
    {
        DEBUG_PRINTLN("- file written");
    }
    else
    {
        DEBUG_PRINTLN("- frite failed");
    }
}
