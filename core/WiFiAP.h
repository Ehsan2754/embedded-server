#ifndef __WIFIAP_H__
#define __WIFIAP_H__


// ACCESS-POINT SSID
#define LOCAL_SSID "ZARNITZA"
#define LOCAL_PASS "12345678"
#define PORTAL_TIMEOUT 60


// WIFI Manager 
#define BLOCKING_MODE true
#define TITLE "ZARNITZA Device Configuration"

// ACCESS-POINT SSID
#define AP_SSID "ZARNITZA"
#define AP_PASS "12345678"


extern WiFiManager wm; // global wm instance
extern WiFiManagerParameter custom_field; // global param ( for non blocking w params )

void WifiAP_setup();
void WifiAP_loop();

#endif //__WIFIAP_H__