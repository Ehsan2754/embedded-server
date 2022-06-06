// #include <WebServer.h> // standard library
#include "config.h"
#include "web.h" // webpage source
#include "webAPP.h"
#include "protocol.h"
#include "ESPAsyncWebServer.h"
#include "SPIFFS.h"



// the JSON array size needs to be bigger that your maximum expected size. 2048 is way too big for this example
// char JSON[JSON_PAYLOAD_SIZE];

// just some buffer holder for char operations
// char buf[BUFFER_SIZE];

// gotta create a server
// WebServer server(80);
// uint8_t Rxp[38];
// void sendWebsite()
// {
//   Serial.println("Serving web page");
//   server.send(200, "text/html", PAGE_MAIN);
// }
// void handle_SEND_COMMAND()
// {
//   Serial.println("Serving " PATH_SEND_COMMAND);
//   if (server.hasArg("plain") == false)
//   {
//     server.send(200, "text/plain", "Body not received");
//     return;
//   }
//   Serial.println("Serving " PATH_SEND_COMMAND);
//   String msg = server.arg("plain");

//   Serial.print("BODY:");
//   for (uint8_t i = 0; i < msg.length(); i++)
//   {
//     Serial.printf(" 0x%X ", msg[i]);
//   }
//   Serial.println();

//   // bytes += "RESULT";
//   auto resp = sendRawBytes(msg);
//   Serial.print("RESP:");
//   for (uint8_t i = 0; i < resp.length(); i++)
//   {
//     Serial.printf(" 0x%X ", resp[i]);
//   }
//   Serial.println();
//   server.send(200, "text/plain", resp);
// }

void webAPP_setup()
{

  Serial.println("Starting server.");

  // server.on("/", HTTP_GET, sendWebsite);
  // server.on(
  //     PATH_SEND_COMMAND, HTTP_POST, handle_SEND_COMMAND);

  // server.begin();
}
void webAPP_loop(void *pvParameters)
{
  // no matter what you must call this handleClient repeatidly--otherwise the web page
  // will not get instructions to do something
  for (;;)
  {
    server.handleClient();
  }
}