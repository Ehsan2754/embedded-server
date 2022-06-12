#ifndef __WEBAPP_HPP__
#define __WEBAPP_HPP__


extern String ssid;
extern String pass;
extern String ip;
extern String gateway;

// Search for parameter in HTTP POST request
extern const char *PARAM_INPUT_1;
extern const char *PARAM_INPUT_2;
extern const char *PARAM_INPUT_3;
extern const char *PARAM_INPUT_4;
void initDNS(bool ap);
void initWebSocket();
void initWebAppServer();
void initWifiAP();
#endif //__WEBAPP_HPP__
