#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <Wire.h>
#include "config.hpp"
#include "bt.hpp"

bool deviceConnected = false;
bool requestFlag = false;
static uint8_t resp[BUFFER_SIZE];
static uint8_t CUD_value[17] = "Characteristic 6";

static uint8_t bt_req[BUFFER_SIZE];
static uint8_t bt_res[BUFFER_SIZE];

// Characteristic and Descriptor
BLECharacteristic *bleNotifyCharacteristics=NULL;
BLEDescriptor bleCUD_Descriptor(BLEUUID((uint16_t)0x2901));

// Setup callbacks onWrite
class MyCharacteristicCallbacks : public BLECharacteristicCallbacks
{
    void onWrite(BLECharacteristic *pCharacteristic)
    {
        if (!requestFlag)
        {
            requestFlag = true;
            std::string value = pCharacteristic->getValue();
            if (value.length() > 0)
            {
                for (int i = 0; i < value.length(); i++)
                {
                    bt_req[i] = value[i];
                }

                if (deviceConnected)
                {
                    auto len = transmitCommand(bt_req, value.length(), bt_res, BUFFER_SIZE);
                    for (int i = 0; i < (len / 20) + 1; i++)
                    {
                        auto startPtr = 20 * i;
                        auto pktLen = (len < (20 * (i + 1))) ? len % 20 : 20;
                        DEBUG_PRINTF("\t>>Packet sent from byte %d to %d\n", startPtr, startPtr + pktLen);
                        DEBUG_PRINTF("\t\t PTR=[MEM@%d,MEM@%d]\n", bt_res + startPtr, bt_res + startPtr + pktLen);
                        bleNotifyCharacteristics->setValue(bt_res + startPtr, pktLen);
                        bleNotifyCharacteristics->notify();
                    }
                }
            }
            requestFlag = false;
        }
    }
};

// Setup callbacks onConnect and onDisconnect
class MyServerCallbacks : public BLEServerCallbacks
{
    void onConnect(BLEServer *pServer)
    {
        deviceConnected = true;
        DEBUG_PRINTLN("DEVICE CONNECTED!");
        DEBUG_PRINTF("\tNUMBER OF CONNECTED DEVICES = %d\n", pServer->getConnectedCount() + 1);
    }
    void onDisconnect(BLEServer *pServer)
    {
        deviceConnected = false;
        DEBUG_PRINTLN("DEVICE DISCONNECTED!");
        DEBUG_PRINTF("\tNUMBER OF CONNECTED DEVICES = %d\n", pServer->getConnectedCount() - 1);
        pServer->getAdvertising()->start();
    }
};

void initBT()
{

    // Create the BLE Device
    BLEDevice::init(bleServerName);

    // Create the BLE Server
    BLEServer *bleServer = BLEDevice::createServer();
    bleServer->setCallbacks(new MyServerCallbacks());

    // Create the BLE Service
    BLEService *bleService = bleServer->createService(SERVICE_UUID);
    bleNotifyCharacteristics = new BLECharacteristic(CHARACTERISTIC_UUID, BLECharacteristic::PROPERTY_READ |
                                                                    BLECharacteristic::PROPERTY_WRITE |
                                                                    BLECharacteristic::PROPERTY_WRITE_NR |
                                                                    BLECharacteristic::PROPERTY_NOTIFY);

    // Create BLE Characteristics and Create  BLE Descriptors
    bleNotifyCharacteristics->setCallbacks(new MyCharacteristicCallbacks());
    bleService->addCharacteristic(bleNotifyCharacteristics);
    bleCUD_Descriptor.setValue(CUD_value, 16);
    bleNotifyCharacteristics->addDescriptor(&bleCUD_Descriptor);
    bleNotifyCharacteristics->addDescriptor(new BLE2902());
    // Start the service
    bleService->start();

    // Start advertising
    BLEAdvertising *bleAdvertising = BLEDevice::getAdvertising();
    bleAdvertising->addServiceUUID(SERVICE_UUID);
    bleAdvertising->setScanResponse(true);
    bleAdvertising->setMinPreferred(0x06);  // functions that help with iPhone connections issue
    bleAdvertising->setMinPreferred(0x12);


    BLEDevice::startAdvertising();
    DEBUG_PRINTLN("Waiting a client connection to notify...");
}

void btHandleRoutine(void *pvParameters)
{
    for (;;)
    {
        // if(SerialBT.available()){
        //     DEBUG_PRINTLN(DEBUG_INFO "Request from BT");
        //     uint16_t req_len = SerialBT.readBytes(bt_req,BUFFER_SIZE);
        //     uint16_t res_len = transmitCommand(bt_req,req_len,bt_res,BUFFER_SIZE);
        //     for(uint16_t i=0;i<res_len;i++){
        //      SerialBT.write(bt_res[i]);
        //     }
        // }
    }
}
