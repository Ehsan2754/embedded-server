#include <Arduino.h>
#include <WiFi.h>
#include <WiFiUdp.h>
#include <HardwareSerial.h>
#include <freertos/semphr.h>
#include "config.hpp"
SemaphoreHandle_t mutex;
bool labLock = false;
const TickType_t xServerDelay = UDP_SERVER_AWAIT / portTICK_PERIOD_MS;
char SN[SERIAL_NO_LEN] = "";
WiFiUDP udp;
const uint16_t table[256] = {
    0x0000, 0xC0C1, 0xC181, 0x0140, 0xC301, 0x03C0, 0x0280, 0xC241,
    0xC601, 0x06C0, 0x0780, 0xC741, 0x0500, 0xC5C1, 0xC481, 0x0440,
    0xCC01, 0x0CC0, 0x0D80, 0xCD41, 0x0F00, 0xCFC1, 0xCE81, 0x0E40,
    0x0A00, 0xCAC1, 0xCB81, 0x0B40, 0xC901, 0x09C0, 0x0880, 0xC841,
    0xD801, 0x18C0, 0x1980, 0xD941, 0x1B00, 0xDBC1, 0xDA81, 0x1A40,
    0x1E00, 0xDEC1, 0xDF81, 0x1F40, 0xDD01, 0x1DC0, 0x1C80, 0xDC41,
    0x1400, 0xD4C1, 0xD581, 0x1540, 0xD701, 0x17C0, 0x1680, 0xD641,
    0xD201, 0x12C0, 0x1380, 0xD341, 0x1100, 0xD1C1, 0xD081, 0x1040,
    0xF001, 0x30C0, 0x3180, 0xF141, 0x3300, 0xF3C1, 0xF281, 0x3240,
    0x3600, 0xF6C1, 0xF781, 0x3740, 0xF501, 0x35C0, 0x3480, 0xF441,
    0x3C00, 0xFCC1, 0xFD81, 0x3D40, 0xFF01, 0x3FC0, 0x3E80, 0xFE41,
    0xFA01, 0x3AC0, 0x3B80, 0xFB41, 0x3900, 0xF9C1, 0xF881, 0x3840,
    0x2800, 0xE8C1, 0xE981, 0x2940, 0xEB01, 0x2BC0, 0x2A80, 0xEA41,
    0xEE01, 0x2EC0, 0x2F80, 0xEF41, 0x2D00, 0xEDC1, 0xEC81, 0x2C40,
    0xE401, 0x24C0, 0x2580, 0xE541, 0x2700, 0xE7C1, 0xE681, 0x2640,
    0x2200, 0xE2C1, 0xE381, 0x2340, 0xE101, 0x21C0, 0x2080, 0xE041,
    0xA001, 0x60C0, 0x6180, 0xA141, 0x6300, 0xA3C1, 0xA281, 0x6240,
    0x6600, 0xA6C1, 0xA781, 0x6740, 0xA501, 0x65C0, 0x6480, 0xA441,
    0x6C00, 0xACC1, 0xAD81, 0x6D40, 0xAF01, 0x6FC0, 0x6E80, 0xAE41,
    0xAA01, 0x6AC0, 0x6B80, 0xAB41, 0x6900, 0xA9C1, 0xA881, 0x6840,
    0x7800, 0xB8C1, 0xB981, 0x7940, 0xBB01, 0x7BC0, 0x7A80, 0xBA41,
    0xBE01, 0x7EC0, 0x7F80, 0xBF41, 0x7D00, 0xBDC1, 0xBC81, 0x7C40,
    0xB401, 0x74C0, 0x7580, 0xB541, 0x7700, 0xB7C1, 0xB681, 0x7640,
    0x7200, 0xB2C1, 0xB381, 0x7340, 0xB101, 0x71C0, 0x7080, 0xB041,
    0x5000, 0x90C1, 0x9181, 0x5140, 0x9301, 0x53C0, 0x5280, 0x9241,
    0x9601, 0x56C0, 0x5780, 0x9741, 0x5500, 0x95C1, 0x9481, 0x5440,
    0x9C01, 0x5CC0, 0x5D80, 0x9D41, 0x5F00, 0x9FC1, 0x9E81, 0x5E40,
    0x5A00, 0x9AC1, 0x9B81, 0x5B40, 0x9901, 0x59C0, 0x5880, 0x9841,
    0x8801, 0x48C0, 0x4980, 0x8941, 0x4B00, 0x8BC1, 0x8A81, 0x4A40,
    0x4E00, 0x8EC1, 0x8F81, 0x4F40, 0x8D01, 0x4DC0, 0x4C80, 0x8C41,
    0x4400, 0x84C1, 0x8581, 0x4540, 0x8701, 0x47C0, 0x4680, 0x8641,
    0x8201, 0x42C0, 0x4380, 0x8341, 0x4100, 0x81C1, 0x8081, 0x4040};

unsigned int transmitCommand(unsigned char *Tx, unsigned int lenTx, unsigned char *Rx, unsigned int lenRx)
{
  // Take the mutex
  unsigned int response_len = 0;
  *Rx = 0x00;
  if (xSemaphoreTake(mutex, TIMEOUT) == pdTRUE)
  {
    if (labLock)
    {
      DEBUG_PRINTLN(DEBUG_LAB "Waiting for device to get free....");
    }
    while (labLock)
    {
      DEBUG_PRINT(".");
    }
    DEBUG_PRINTLN();
    labLock = true;

    LAB_SERIAL.flush();

    for (auto i = 0; i < lenTx; i++)
    {
      LAB_SERIAL.write(*(Tx + i));
    }
    DEBUG_PRINTF(DEBUG_LAB "Request-packet Len=%d\n", lenTx);
    DEBUG_PRINT(DEBUG_LAB "Request-packet={");
    for (auto i = 0; i < lenTx; i++)
    {
      DEBUG_PRINTF(" 0x%X ", *(Tx + i));
      if (i != lenTx - 1)
      {
        DEBUG_PRINTF(",");
      }
    }
    DEBUG_PRINT("}");
    DEBUG_PRINTLN();
    response_len = LAB_SERIAL.readBytes(Rx, lenRx);
    // DEBUG_PRINTF("\t\t >> FRIST BYTE = 0x%X\n",*Rx);
    DEBUG_PRINTF(DEBUG_LAB "Response-packet Len=%d\n", response_len);
    DEBUG_PRINT(DEBUG_LAB "Response-packet={");
    for (auto i = 0; i < response_len; i++)
    {
      DEBUG_PRINTF(" 0x%X ", *(Rx + i));
      if (i != response_len - 1)
      {
        DEBUG_PRINTF(",");
      }
    }
    DEBUG_PRINT("}");
    DEBUG_PRINTLN();
    labLock = false;

    // Release the mutex so that the creating function can finish
    xSemaphoreGive(mutex);
  }
  return response_len;
}
uint16_t MODBUS_CRC16(unsigned char *buf, unsigned int len)
{

  uint8_t myxor = 0;
  uint16_t crc = 0xFFFF;

  while (len--)
  {
    myxor = (*buf++) ^ crc;
    crc >>= 8;
    crc ^= table[myxor];
  }
  DEBUG_PRINTF(DEBUG_LAB "CRC-16/MODBUS = 0x%X\n", (uint16_t)(crc << 8 | crc >> 8));
  return crc << 8 | crc >> 8;
}
uint16_t obtainSerialNumber()
{
  DEBUG_PRINTLN(DEBUG_LAB "Obtaining  Serial Number.");
  unsigned char GET_HW_CONFIG_Tx[] = {0xAA, 0x06, 0x00, 0x83, 0x80, 0x5C};
  unsigned char RESP_BUFFER[128];
  auto LenResp = transmitCommand(GET_HW_CONFIG_Tx, 6, RESP_BUFFER, 128);
  auto expectedLen = 66;
  uint16_t SerialNumber = 0;
  if (!LenResp)
  {
    DEBUG_PRINTF(DEBUG_LAB "Device is off.\n", LenResp, expectedLen);
    return 0;
  }

  if (LenResp != expectedLen)
  {
    DEBUG_PRINTF(DEBUG_LAB "ERROR->Invalid Package Length! GOT:%d : EXPECTED %d\n", LenResp, expectedLen);
    SerialNumber = 0;
  }
  if (((RESP_BUFFER[LenResp - 2] << 8) | RESP_BUFFER[LenResp - 1]) != MODBUS_CRC16(RESP_BUFFER, LenResp - 2))
  {
    DEBUG_PRINTLN(DEBUG_LAB "ERROR->Invalid CRC!");
    SerialNumber = 0;
  }
  else
  {
    SerialNumber = (RESP_BUFFER[5] << 8) | (RESP_BUFFER[4]);
  }
  if (!SerialNumber)
  {
    DEBUG_PRINTLN(DEBUG_LAB "ERROR OBTAINING SERIAL NUMBER!");
  }
  else
  {
    DEBUG_PRINTF(DEBUG_LAB ">> SERIAL NUMBER : %08d\n", SerialNumber);
  }
  return SerialNumber;
}
void getSerialNumber()
{
  uint16_t intSN = 0x00;
  for (uint8_t i = 0; i < 50; i++)
  {
    if (intSN)
    {
      DEBUG_PRINTLN(DEBUG_LAB ">> SERIAL NUMBER FOUND.");
      break;
    }
    intSN = obtainSerialNumber();
    delay(250);
  }

  sprintf(SN, "%05d", intSN); // FFFF = 65535 so max digits in DEC is 5
  DEBUG_PRINT(DEBUG_LAB "REGISTERED-SERIAL:=");
  DEBUG_PRINTLN(SN);
}
const char *SERVER_ADDR = UDP_SERVER_IP;
const int SERVER_PORT = UDP_SERVER_PORT;
static uint16_t packetSize = 0;
static unsigned char serverPacket[BUFFER_SIZE];
static unsigned char serverResponse[BUFFER_SIZE];

void serverConnectionHandleRoutine(void *pvParameters)
{
  DEBUG_PRINT(DEBUG_SERVER "Connecting Server TCP SOCKET : ");
  DEBUG_PRINT(SERVER_ADDR);
  DEBUG_PRINTLN(SERVER_PORT);

  bool established = false;
  for (;;)
  {
    packetSize = 0;

    if (!established)
    {
      DEBUG_PRINTLN(DEBUG_SERVER "Establishing connection");
      udp.beginPacket(SERVER_ADDR, SERVER_PORT);
      unsigned char serialPKT[11];
      serialPKT[0] = '$';
      for (auto i = 0; i < SERIAL_NO_LEN; i++)
      {
        serialPKT[i + 1] = SN[i];
      }
      uint16_t serialPKT_crc = MODBUS_CRC16(serialPKT, SERIAL_NO_LEN + 1);
      serialPKT[SERIAL_NO_LEN + 1] = (unsigned char)(serialPKT_crc >> 8);
      serialPKT[SERIAL_NO_LEN + 2] = (unsigned char)serialPKT_crc;
      for (auto i = 0; i < SERIAL_NO_LEN + 3; i++)
      {
        udp.write(serialPKT[i]);
      }

      udp.endPacket();
    }
    vTaskDelay(xServerDelay);
    packetSize = udp.parsePacket();
    if (packetSize)
    {
      uint16_t serverReqLen = udp.read(serverPacket, BUFFER_SIZE);
      DEBUG_PRINT(DEBUG_SERVER "Incoming PACKET SIZE=");
      DEBUG_PRINTLN(serverReqLen);
      static const auto CRC_LEN = 2;
      if ((serverReqLen == (SERIAL_NO_LEN + 1 + CRC_LEN)) && (!established) && (serverPacket[0] == '$'))
      {
        // Establishment Packet
        DEBUG_PRINTLN(DEBUG_SERVER "Establishment Packet Received.");
        // check SN match
        bool matchSN = true;
        for (uint8_t i = 1; i < (SERIAL_NO_LEN + 1); i++)
        {
          if (serverPacket[i] != SN[i - 1])
          {
            DEBUG_PRINTLN(DEBUG_SERVER "CONNECTION Failed Establishment.");
            matchSN = false;
            break;
          }
        }
        if (matchSN)
        {
          DEBUG_PRINTLN(DEBUG_SERVER "SERIAL NUMBER MATCHED RESPONSE!");
          auto crc = MODBUS_CRC16(serverPacket, SERIAL_NO_LEN + 1);
          if ((serverPacket[serverReqLen - 2] == (uint8_t)(crc >> 8)) &&
              (serverPacket[serverReqLen - 1] == (uint8_t)(crc)))
          {
            established = true;
            DEBUG_PRINTLN(DEBUG_SERVER "CONNECTION Established.");
          }
          else
          {
            DEBUG_PRINTLN(DEBUG_SERVER "CONNECTION Establishment failed matching in CRC.");
          }
        }
      }
      else
      {
        // Command Packet
        DEBUG_PRINTLN(DEBUG_SERVER "Command Packet Received.");
        DEBUG_PRINTLN(DEBUG_SERVER "Retriving result from the lab.");
        auto serverRespLen = transmitCommand(serverPacket, serverReqLen, serverResponse, BUFFER_SIZE);
        udp.beginPacket(SERVER_ADDR, SERVER_PORT);
        DEBUG_PRINT(DEBUG_SERVER "RESPONSE PACKET LENGTH=");
        DEBUG_PRINTLN(serverRespLen);
        for (auto i = 0; i < serverRespLen; i++)
        {
          udp.write(serverResponse[i]);
        }

        udp.endPacket();
        DEBUG_PRINTLN(DEBUG_SERVER "Server request answered.");
      }
    }
  }
}
void printWifiStatus()
{

  // print the SSID of the network you're attached to:
  DEBUG_PRINT(DEBUG_INFO "SSID: ");
  DEBUG_PRINTLN(WiFi.SSID());

  // print your WiFi shield's IP address:
  auto ip = WiFi.localIP();
  DEBUG_PRINT(DEBUG_INFO "IP Address: ");
  DEBUG_PRINTLN(ip);

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  DEBUG_PRINT(DEBUG_INFO "signal strength (RSSI):");
  DEBUG_PRINT(rssi);
  DEBUG_PRINTLN(" dBm");
  // print where to go in a browser:
  DEBUG_PRINT(DEBUG_INFO "Open http://");
  DEBUG_PRINTLN(ip);
}
