#include <WiFi.h>
#include <NetworkClient.h>
#include <ESPmDNS.h>
#include "Ssid.h"
#include "Const.h"
#include "WebControl.h"

#define COMMAND_SUSTAIN_MS 500

WebServer *WebControl::server;
Command WebControl::command;
int WebControl::lastTime = 0;

WebControl::WebControl()
  : ready(false) {
  // lazy initialization of webserver to save memory
  WebControl::server = new WebServer(80);
  resetCommand();
}


void WebControl::handleRoot() {
  WebControl::server->send(200, "text/plain", "hello from esp32!");
}

void WebControl::handleNotFound() {
  String message = "File Not Found\n\n";
  message += "URI: ";
  message += WebControl::server->uri();
  message += "\nMethod: ";
  message += (WebControl::server->method() == HTTP_GET) ? "GET" : "POST";
  message += "\nArguments: ";
  message += WebControl::server->args();
  message += "\n";
  for (uint8_t i = 0; i < WebControl::server->args(); i++) {
    message += " " + WebControl::server->argName(i) + ": " + WebControl::server->arg(i) + "\n";
  }
  WebControl::server->send(404, "text/plain", message);
}

void WebControl::handleLawnMover() {
  if (WebControl::server->method() != HTTP_POST) {
    WebControl::server->send(400, "text/plain", "only support post");
    return;
  }
  if (WebControl::server->args() != 4) {
    WebControl::server->send(400, "text/plain", "request must contains 4 key form-data body: accel / steer / lift / engine");
    return;
  }
  String message = "Accepted: \n";
  message += "accel: " + WebControl::server->arg(0) + "\n";
  message += "steer: " + WebControl::server->arg(1) + "\n";
  message += "lift: " + WebControl::server->arg(2) + "\n";
  message += "engine: " + WebControl::server->arg(3) + "\n";
  command.accel = WebControl::processInput(WebControl::server->arg(0));
  command.steer = WebControl::processInput(WebControl::server->arg(1));
  command.lift = WebControl::processInput(WebControl::server->arg(2));
  command.engine = WebControl::processInput(WebControl::server->arg(3));
  WebControl::server->send(200, "text/plain", message);
  WebControl::lastTime = millis();

  // blink white light on reveiced command
  rgbLedWrite(LED_PIN, 255, 255, 255);
}

void WebControl::setup(void) {
  WiFi.mode(WIFI_STA);
  WiFi.setSleep(WIFI_PS_NONE);    // disable power saving
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.println("");

  // Wait for connection (blink blue light while not connected)
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
    rgbLedWrite(LED_PIN, 0, 0, 0);
    delay(300);
    rgbLedWrite(LED_PIN, 0, 0, 255);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(WIFI_SSID);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  if (MDNS.begin("esp32")) {
    Serial.println("MDNS responder started");
  }

  WebControl::server->enableCORS();
  WebControl::server->on("/", WebControl::handleRoot);
  WebControl::server->on("/lawnmower", WebControl::handleLawnMover);
  WebControl::server->onNotFound(WebControl::handleNotFound);
  WebControl::server->begin();
  Serial.println("HTTP server started");
  ready = true;
}

void WebControl::tick() {
  rgbLedWrite(LED_PIN, 0, 0, 255);
  WebControl::server->handleClient();

  if (millis() - WebControl::lastTime > COMMAND_SUSTAIN_MS) {
    WebControl::lastTime = millis();
    resetCommand();
  }
}

void WebControl::resetCommand() {
  WebControl::command.accel = 0.f;
  WebControl::command.steer = 0.f;
  WebControl::command.lift = 0.f;
  WebControl::command.engine = 0.f;
}

Command WebControl::getCommand() {
  Command output;
  output.accel = WebControl::command.accel;
  output.steer = WebControl::command.steer;
  output.lift = WebControl::command.lift;
  output.engine = WebControl::command.engine;
  return output;
}

float WebControl::processInput(const String &text) {
  float x = text.toFloat() * -1.f;
  if (x > 1.f) x = 1.f;
  else if (x < -1.f) x = -1.f;
  return x;
}
