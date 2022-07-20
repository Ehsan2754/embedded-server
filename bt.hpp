#ifndef __BT_HPP__
#define __BT_HPP__
#define BT_TIMEOUT 100

extern bool deviceConnected;
void initBT();
void btHandleRoutine(void *pvParameters);

#endif//__BT_HPP__
