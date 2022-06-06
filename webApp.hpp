#ifndef __WEBAPP_HPP__
#define __WEBAPP_HPP__
#define CYCLE_INTERVAL 1000
#define DOMAIN "zarnitza" SERIAL_NO
extern String ssid;
extern String pass;
extern String ip;
extern String gateway;
// Search for parameter in HTTP POST request
extern const char *PARAM_INPUT_1;
extern const char *PARAM_INPUT_2;
extern const char *PARAM_INPUT_3;
extern const char *PARAM_INPUT_4;

void initDNS();
void initWebAppServer();
void initWifiAP();
#endif //__WEBAPP_HPP__
