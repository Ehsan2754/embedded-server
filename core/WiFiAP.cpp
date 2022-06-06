#include "WiFiManager.h" // https://github.com/tzapu/WiFiManager
#include "config.h"
#include "WiFiAP.h"
WiFiManager wm;                    // global wm instance
WiFiManagerParameter custom_field; // global param ( for non blocking w params )

String getParam(String name)
{
  // read parameter from server, for customhmtl input
  String value;
  if (wm.server->hasArg(name))
  {
    value = wm.server->arg(name);
  }
  return value;
}

void saveParamCallback()
{
  Serial.println("[CALLBACK] saveParamCallback fired");
  Serial.println("PARAM customfieldid = " + getParam("customfieldid"));
}

void checkButton()
{
  // check for button press
  if (digitalRead(PIN_TRIGGER) == LOW)
  {
    // poor mans debounce/press-hold, code not ideal for production
    delay(50);
    if (digitalRead(PIN_TRIGGER) == LOW)
    {
      Serial.println("Button Pressed");
      // still holding button for 3000 ms, reset settings, code not ideaa for production
      delay(3000); // reset delay hold
      if (digitalRead(PIN_TRIGGER) == LOW)
      {
        Serial.println("Button Held");
        Serial.println("Erasing Config, restarting");
        wm.resetSettings();
        ESP.restart();
      }

      // start portal w delay
      Serial.println("Starting config portal");
      wm.setConfigPortalTimeout(PORTAL_TIMEOUT);

      if (!wm.startConfigPortal(AP_SSID, AP_PASS))
      {
        Serial.println("failed to connect or hit timeout");
        delay(3000);
        // ESP.restart();
      }
      else
      {
        // if you get here you have connected to the WiFi
        Serial.println("connected.");
      }
    }
  }
}
void WifiAP_setup()
{
  wm.setConfigPortalBlocking(BLOCKING_MODE);
  int customFieldLength = 40;
  const char *custom_radio_str = "<br/><label for='customfieldid'>Custom Field Label</label><input type='radio' name='customfieldid' value='1' checked> One<br><input type='radio' name='customfieldid' value='2'> Two<br><input type='radio' name='customfieldid' value='3'> Three";
  new (&custom_field) WiFiManagerParameter(custom_radio_str); // custom html input
  wm.addParameter(&custom_field);
  wm.setSaveParamsCallback(saveParamCallback);
  wm.setTitle(TITLE);
  std::vector<const char *> menu = {"wifi", "info", "param", "sep", "restart", "exit"};
  wm.setMenu(menu);

  // set dark theme
  wm.setClass("invert");
  wm.setConfigPortalTimeout(AP_TIMEOUT); // auto close configportal after n seconds
  bool res;
  res = wm.autoConnect(AP_SSID, AP_PASS); // password protected ap
  if (!res)
  {
    Serial.println("Failed to connect or hit timeout.");
    // ESP.restart();
  }
  else
  {
    // if you get here you have connected to the WiFi
    Serial.println("connected.");
  }
}

void WifiAP_loop(void *pvParameters)
{
  for (;;)
  {
    if (!BLOCKING_MODE)
      wm.process(); // avoid delays() in loop when non-blocking and other long running code
    checkButton();
  }
  // put your main code here, to run repeatedly:
}
