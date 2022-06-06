#ifndef __FILESTSTEM_HPP__
#define __FILESTSTEM_HPP__

// File paths to save input values permanently
extern const char *ssidPath;
extern const char *passPath;
extern const char *ipPath;
extern const char *gatewayPath;

// Initialize SPIFFS
void initSPIFFS();
// Read File from SPIFFS
String readFile(fs::FS &fs, const char *path);
// Write file to SPIFFS
void writeFile(fs::FS &fs, const char *path, const char *message);
#endif //__FILESTSTEM_HPP__
