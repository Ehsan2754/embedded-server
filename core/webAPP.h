#ifndef __WEBAPP_H__
#define __WEBAPP_H__
#ifndef _UINT8_T_DECLARED
typedef unsigned char uint8_t;
#define _UINT8_T_DECLARED
#endif
#ifndef _UINT16_T_DECLARED
typedef short unsigned int uint16_t;
#define _UINT16_T_DECLARED
#endif
#define JSON_PAYLOAD_SIZE 2048
#define BUFFER_SIZE 32
extern uint8_t RxP[38];

#define PATH_SUBSCRIBE "/subscribe/" SERIAL_NO
#define PATH_SEND_COMMAND "/send-command/" SERIAL_NO
void webAPP_setup();
void webAPP_loop(void *pvParameters);

#endif //__WEBAPP_H__