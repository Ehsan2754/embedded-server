#ifndef __WEBSERVER_H__
#define __WEBSERVER_H__

#define JSON_PAYLOAD_SIZE 2048
#define BUFFER_SIZE 32

void webServer_setup();
void webServer_loop(void * pvParameters);

#endif //__WEBSERVER_H__