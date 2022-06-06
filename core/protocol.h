#ifndef __PROTOCOL_H__
#define __PROTOCOL_H__

#ifndef _UINT8_T_DECLARED
typedef unsigned char uint8_t;
#define _UINT8_T_DECLARED
#endif
#ifndef _UINT16_T_DECLARED
typedef short unsigned int uint16_t;
#define _UINT16_T_DECLARED
#endif
//

#define MAX_PACKET_SIZE 2048
#define WSTIMEOUT 10
// #define START_BYTE_LEN 1
#define LEN_HDR 1
#define LEN_CMD 1
#define LEN_CRC 2
// Commands
#define cmd_getInfo 0x00
#define cmd_getInfo_BT 0x01
#define cmd_Data_Exchange 0x10
#define cmd_Data_Exchange_BT 0x11
#define cmd_Debug_RawData_Exchange 0x1F
#define cmd_ArchiveControl 0x20
#define cmd_getArchive 0x21
#define cmd_getArchive_BT 0x22
#define cmd_set_HW_Config 0x30
#define cmd_get_HW_Config 0x31
#define cmd_get_HW_Config_BT 0x32
#define cmd_set_UserData 0x40
#define cmd_get_UserData 0x41
#define cmd_BLE_ATCmd_Exchange 0x50
#define cmd_bootloader_writeFlash 0x80
#define cmd_bootloader_readFlash 0x81
#define cmd_bootloader_set_FW_Cfg 0x82
#define cmd_bootloader_get_FW_Cfg 0x83
#define cmd_bootloader_init 0x84
#define cmd_bootloader_finish 0x85
#define cmd_bootloader_set_FW_Cfg_BT 0x86
#define cmd_bootloader_get_FW_Cfg_BT 0x87
#define cmd_bootloader_writeFlash_BT 0x8A
#define cmd_bootloader_readFlash_BT 0x8B
#define cmd_boardStatistics 0xFE
#define cmd_notSupported_cmd 0xFF

#define STATUS_OK 0
#define STATUS_ERROR 1

// String sendRawBytes(String bytes);
uint8_t send_REQ(uint8_t HDR, uint8_t CMD, uint8_t *Tx, uint16_t REQ_LEN, uint8_t *Rx, uint16_t RESP_LEN);
static uint16_t MODBUS_CRC16(const uint8_t *buf, unsigned int len);

#endif //__PROTOCOL_H__
