#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <Wire.h>
#include "config.hpp"
#include "bt.hpp"

bool deviceConnected = false;
bool requestFlag = false;

uint8_t CUD_value[17] = "Characteristic 6";

static uint8_t bt_req[BUFFER_SIZE];
static uint8_t bt_res[BUFFER_SIZE];

BLEDescriptor cudDescriptor(BLEUUID((uint16_t)0x2901));

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
                        DEBUG_PRINTF(DEBUG_APP"\t>>Packet sent from byte %d to %d\n", startPtr, startPtr + pktLen);
                        DEBUG_PRINTF("\t\t PTR=[MEM@%d,MEM@%d]\n", bt_res + startPtr, bt_res + startPtr + pktLen);
                        pCharacteristic->setValue(bt_res + startPtr, pktLen);
                        pCharacteristic->notify();
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
    void onConnect(BLEServer *pServer, esp_ble_gatts_cb_param_t *param)
    {
        deviceConnected = true;
        pServer->updateConnParams(param->connect.remote_bda, 0x06, 0x12, 0, 100);
        DEBUG_PRINTLN(DEBUG_APP"DEVICE CONNECTED!");
        DEBUG_PRINTF("\tNUMBER OF CONNECTED DEVICES = %d\n", pServer->getConnectedCount() + 1);
    }
    void onDisconnect(BLEServer *pServer)
    {
        deviceConnected = false;
        DEBUG_PRINTLN(DEBUG_APP"DEVICE DISCONNECTED!");
        DEBUG_PRINTF("\tNUMBER OF CONNECTED DEVICES = %d\n", pServer->getConnectedCount() - 1);
        pServer->getAdvertising()->start();
    }
};
void deinitBT()
{
    BLEDevice::deinit(true);
}
void initBT()
{
    char devname[20];
    sprintf(devname,"%s-%s",obtainLabtype(),SN);
    DEBUG_PRINTF(DEBUG_INFO"BT-Beacon->%s\n",devname);
    // Create the BLE Device
    BLEDevice::init(devname);

    // Create the BLE Server
    BLEServer *bleServer = BLEDevice::createServer();
    bleServer->setCallbacks(new MyServerCallbacks());

    // Create the BLE Service
    BLEService *bleService = bleServer->createService(SERVICE_UUID);
    
    // Create BLE Characteristics and Create  BLE Descriptors
    BLECharacteristic *bleCharacteristics = bleService->createCharacteristic(CHARACTERISTIC_UUID, BLECharacteristic::PROPERTY_READ |
                                                                              BLECharacteristic::PROPERTY_WRITE |
                                                                              BLECharacteristic::PROPERTY_WRITE_NR |
                                                                              BLECharacteristic::PROPERTY_NOTIFY);

    bleCharacteristics->setCallbacks(new MyCharacteristicCallbacks());
    cudDescriptor.setValue(CUD_value, 16);
    bleCharacteristics->addDescriptor(&cudDescriptor);
    bleCharacteristics->addDescriptor(new BLE2902());

    bleService->addCharacteristic(bleCharacteristics);
    
    // Start the service
    bleService->start();

    // Start advertising
    BLEAdvertising *bleAdvertising = bleServer->getAdvertising();
    bleAdvertising->addServiceUUID(SERVICE_UUID);
    bleAdvertising->setScanResponse(true);
    bleAdvertising->setMinPreferred(0x06); // functions that help with iPhone connections issue
    // bleAdvertising->setMinPreferred(0x12);
    bleAdvertising->start();
    BLEDevice::startAdvertising();
    DEBUG_PRINTLN(DEBUG_INFO"Waiting a client connection to notify...");
}

void btHandleRoutine(void *pvParameters)
{

}
