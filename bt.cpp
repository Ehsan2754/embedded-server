#include <HardwareSerial.h>
#include <BluetoothSerial.h>
#include "config.hpp"
#include "bt.hpp"

BluetoothSerial SerialBT;
static char bt_str[BT_NAME_LEN + SERIAL_NO_LEN];
void initBT(){
  sprintf(bt_str, "%s%s", BT_NAME, SN);
  SerialBT.begin(bt_str); 
  SerialBT.setTimeout(BT_TIMEOUT);
  DEBUG_PRINTLN(DEBUG_INFO "Bluetooth Node initialized.");
  DEBUG_PRINT(DEBUG_INFO "BT-NAME=");
  DEBUG_PRINTLN(bt_str);
}
static uint8_t bt_req[BUFFER_SIZE];
static uint8_t bt_res[BUFFER_SIZE];
void btHandleRoutine(void *pvParameters){
    for(;;){
        if(SerialBT.available()){
            uint16_t req_len = SerialBT.readBytes(bt_req,BUFFER_SIZE);
            uint16_t res_len = transmitCommand(bt_req,req_len,bt_res,BUFFER_SIZE);
            for(uint16_t i=0;i<res_len;i++){
             SerialBT.write(bt_res[i]);   
            }
        }
    }
}
