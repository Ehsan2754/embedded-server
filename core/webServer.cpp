#include <WebServer.h> // standard library
#include "web.h"       // webpage source
#include "webServer.h"

// the JSON array size needs to be bigger that your maximum expected size. 2048 is way too big for this example
char JSON[JSON_PAYLOAD_SIZE];

// just some buffer holder for char operations
char buf[BUFFER_SIZE];

// gotta create a server
WebServer server(80);
void SendWebsite()
{

  Serial.println("sending web page");
  // you may have to play with this value, big pages need more porcessing time, and hence
  // a longer timeout that 200 ms
  server.send(200, "text/html", PAGE_MAIN);
}

void webServer_setup()
{

  Serial.println("starting server");

  server.on("/", SendWebsite);
  // server.on("/xml", SendXML);
  // server.on("/UPDATE_SLIDER", UpdateSlider);
  // server.on("/BUTTON_0", ProcessButton_0);
  // server.on("/BUTTON_1", ProcessButton_1);
  server.begin();
}
void webServer_loop(void *pvParameters)
{
  // no matter what you must call this handleClient repeatidly--otherwise the web page
  // will not get instructions to do something
  for (;;)
  {
    server.handleClient();
  }
}