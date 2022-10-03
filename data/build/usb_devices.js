'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

//данный лист заполняется согласно ListBox Sensors_select
var LabSensorType;
(function (LabSensorType) {
    LabSensorType[LabSensorType["TempSensor"] = 10] = "TempSensor";
    LabSensorType[LabSensorType["AbsolutePressureSensor"] = 11] = "AbsolutePressureSensor";
    LabSensorType[LabSensorType["TeslameterSensor"] = 12] = "TeslameterSensor";
    LabSensorType[LabSensorType["VoltmeterSensor"] = 13] = "VoltmeterSensor";
    LabSensorType[LabSensorType["AmmeterSensor"] = 14] = "AmmeterSensor";
    LabSensorType[LabSensorType["AccelerometerXSensor"] = 15] = "AccelerometerXSensor";
    LabSensorType[LabSensorType["AccelerometerYSensor"] = 16] = "AccelerometerYSensor";
    LabSensorType[LabSensorType["AccelerometerZSensor"] = 17] = "AccelerometerZSensor";
    LabSensorType[LabSensorType["ConductivitySensor"] = 18] = "ConductivitySensor";
    LabSensorType[LabSensorType["HumiditySensor"] = 19] = "HumiditySensor";
    LabSensorType[LabSensorType["LightSensor"] = 110] = "LightSensor";
    LabSensorType[LabSensorType["TempOutsideSensor"] = 111] = "TempOutsideSensor";
    LabSensorType[LabSensorType["ColorimeterSensor"] = 112] = "ColorimeterSensor";
    LabSensorType[LabSensorType["PhSensor"] = 113] = "PhSensor";
    LabSensorType[LabSensorType["ArterialPressureSensor"] = 114] = "ArterialPressureSensor";
    LabSensorType[LabSensorType["PulseSensor"] = 115] = "PulseSensor";
    LabSensorType[LabSensorType["BodyTempSensor"] = 116] = "BodyTempSensor";
    LabSensorType[LabSensorType["RespirationRateSensor"] = 117] = "RespirationRateSensor";
    LabSensorType[LabSensorType["IonomerSensor"] = 118] = "IonomerSensor";
})(LabSensorType || (LabSensorType = {}));
var UsbSensorType;
(function (UsbSensorType) {
    UsbSensorType[UsbSensorType["ColorimeterSensor"] = 20] = "ColorimeterSensor";
    UsbSensorType[UsbSensorType["UsbLightSensor"] = 21] = "UsbLightSensor";
    UsbSensorType[UsbSensorType["WristSensor"] = 22] = "WristSensor";
    UsbSensorType[UsbSensorType["SoilMoistureSensor"] = 23] = "SoilMoistureSensor";
    UsbSensorType[UsbSensorType["CoSensor"] = 24] = "CoSensor";
    UsbSensorType[UsbSensorType["OpticalDensitySensor"] = 25] = "OpticalDensitySensor";
    UsbSensorType[UsbSensorType["SoundSensor"] = 26] = "SoundSensor";
    UsbSensorType[UsbSensorType["CardioSensor"] = 27] = "CardioSensor";
    UsbSensorType[UsbSensorType["OscilloscopeSensor"] = 28] = "OscilloscopeSensor";
})(UsbSensorType || (UsbSensorType = {}));
const SensorType = { ...LabSensorType, ...UsbSensorType };

class CalibrationSteps {
    min;
    max;
    static OnlyBoth = new CalibrationSteps(2, 2);
    static Automated = new CalibrationSteps(-1, -1);
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }
}

var strings;
(function (strings) {
    strings["calibrationCoefficient"] = "\u041A\u043E\u044D\u0444\u0444\u0438\u0446\u0438\u0435\u043D\u0442 \u0434\u0430\u0442\u0447\u0438\u043A\u0430";
    strings["labTitle"] = "\u041B\u0430\u0431\u043E\u0440\u0430\u0442\u043E\u0440\u0438\u044F";
    strings["sensorsVisibilityTitle"] = "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u043C\u0443\u043B\u044C\u0442\u0438\u0434\u0430\u0442\u0447\u0438\u043A\u0430";
    strings["triggerSettingsTitle"] = "\u0422\u0440\u0438\u0433\u0433\u0435\u0440";
    strings["rangeSettingsTitle"] = "\u0420\u0430\u0437\u0432\u0435\u0440\u0442\u043A\u0430";
    strings["channelSettingsTitle"] = "\u041A\u0430\u043D\u0430\u043B\u044B";
    strings["triggerSource"] = "\u0418\u0441\u0442\u043E\u0447\u043D\u0438\u043A";
    strings["triggerMode"] = "\u0420\u0435\u0436\u0438\u043C";
    strings["triggerModeAuto"] = "\u0410\u0432\u0442\u043E";
    strings["triggerModeWaiting"] = "\u0416\u0434\u0443\u0449.";
    strings["triggerModeSingle"] = "\u041E\u0434\u043D\u043E\u043A\u0440.";
    strings["triggerType"] = "\u0422\u0438\u043F";
    strings["triggerTypeUp"] = "\u0412\u043E\u0441\u0445.";
    strings["triggerTypeDown"] = "\u041D\u0438\u0441\u0445.";
    strings["triggerLevel"] = "\u0423\u0440\u043E\u0432\u0435\u043D\u044C";
    strings["range"] = "\u0414\u0438\u0430\u043F\u0430\u0437\u043E\u043D";
    strings["offset"] = "\u0421\u043C\u0435\u0449\u0435\u043D\u0438\u0435";
    strings["channel1"] = "\u041A\u0430\u043D\u0430\u043B 1";
    strings["channel2"] = "\u041A\u0430\u043D\u0430\u043B 2";
    strings["usDiv"] = "\u043C\u043A\u0441/\u0434\u0435\u043B";
    strings["msDiv"] = "\u043C\u0441/\u0434\u0435\u043B";
    strings["mVolts"] = "\u043C\u0412";
    strings["volts"] = "\u0412";
    strings["voltsDiv"] = "\u0412/\u0434\u0435\u043B";
    strings["mVoltsDiv"] = "\u043C\u0412/\u0434\u0435\u043B";
    strings["oscilloscopeSettingsTitle"] = "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u043E\u0441\u0446\u0438\u043B\u043B\u043E\u0433\u0440\u0430\u0444\u0430";
    strings["resetServerUrl"] = "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0430\u0434\u0440\u0435\u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u0430";
    strings["openRemoteApp"] = "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0443\u0434\u0430\u043B\u0435\u043D\u043D\u043E\u0435 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435";
    strings["connectToServer"] = "\u0421\u043E\u0435\u0434\u0438\u043D\u0438\u0442\u044C\u0441\u044F \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u043E\u043C";
    strings["takeAPicture"] = "\u0421\u0434\u0435\u043B\u0430\u0442\u044C \u0444\u043E\u0442\u043E";
    strings["startRecording"] = "\u041D\u0430\u0447\u0430\u0442\u044C \u0437\u0430\u043F\u0438\u0441\u044C";
    strings["stopRecording"] = "\u041E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u0437\u0430\u043F\u0438\u0441\u044C";
    strings["recording"] = "\u0417\u0430\u043F\u0438\u0441\u044C";
    strings["devices"] = "\u0423\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430";
    strings["bpm"] = "\u0443\u0434./\u043C\u0438\u043D";
    strings["mmHg"] = "\u043C\u043C. \u0440\u0442.\u0441\u0442";
    strings["confirmInstallMessage"] = "\u0414\u043B\u044F \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0435\u043D\u0438\u044F \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0438 \u0442\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F \u043F\u0435\u0440\u0435\u0437\u0430\u043F\u0443\u0441\u043A \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F";
    strings["updateError"] = "\u0412\u043E \u0432\u0440\u0435\u043C\u044F \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F \u043F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430";
    strings["checkingUpdates"] = "\u041F\u0440\u043E\u0432\u0435\u0440\u044F\u0435\u0442\u0441\u044F \u043D\u0430\u043B\u0438\u0447\u0438\u0435 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0439...";
    strings["updateFWTitle"] = "\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u041F\u041E";
    strings["successUpdate"] = "\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E!";
    strings["pleaseRebootLab"] = "\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043F\u0435\u0440\u0435\u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 \u043B\u0430\u0431\u043E\u0440\u0430\u0442\u043E\u0440\u0438\u044E!";
    strings["newVersionAvailable"] = "\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u0430 \u043D\u043E\u0432\u0430\u044F \u0432\u0435\u0440\u0441\u0438\u044F";
    strings["updateLabTitle"] = "\u041E\u0431\u043D\u043E\u043B\u0435\u043D\u0438\u0435 \u041F\u041E \u043B\u0430\u0431\u043E\u0440\u0430\u0442\u043E\u0440\u0438\u0438";
    strings["checkLabUpdate"] = "\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u043B\u0430\u0431\u043E\u0440\u0430\u0442\u043E\u0440\u0438\u0438";
    strings["autoScaleIsOn"] = "\u0430\u0432\u0442\u043E \u043C\u0430\u0441\u0448\u0442\u0430\u0431";
    strings["openDocumentation"] = "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0438\u043D\u0441\u0442\u0440\u0443\u043A\u0446\u0438\u044E";
    strings["documentation"] = "\u0418\u043D\u0441\u0442\u0440\u0443\u043A\u0446\u0438\u044F";
    strings["programVersion"] = "\u0412\u0435\u0440\u0441\u0438\u044F \u041F\u041E";
    strings["noInternetConnection"] = "\u041D\u0435\u0442 \u0441\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u044F \u0441 \u0438\u043D\u0442\u0435\u0440\u043D\u0435\u0442\u043E\u043C";
    strings["allUpdated"] = "\u0423 \u0432\u0430\u0441 \u0441\u0430\u043C\u0430\u044F \u043F\u043E\u0441\u0434\u0435\u0434\u043D\u044F\u044F \u0432\u0435\u0440\u0441\u0438\u044F \u041F\u041E";
    strings["checkFWUpdate"] = "\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u041F\u041E";
    strings["lightTheme"] = "\u0421\u0432\u0435\u0442\u043B\u0430\u044F \u0442\u0435\u043C\u0430";
    strings["darkTheme"] = "\u0422\u0435\u043C\u043D\u0430\u044F \u0442\u0435\u043C\u0430";
    strings["theme"] = "\u0422\u0435\u043C\u0430 \u043E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u044F";
    strings["calibration_writeAPasswordModalHeader"] = "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u044C";
    strings["refreshInterval"] = "\u041F\u0435\u0440\u0438\u043E\u0434 \u043E\u043F\u0440\u043E\u0441\u0430";
    strings["disconnected"] = "\u041E\u0442\u043A\u043B\u044E\u0447\u0435\u043D";
    strings["connected"] = "\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D";
    strings["sensorsPackSubtitle"] = "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0434\u0430\u0442\u0447\u0438\u043A\u0438 \u0434\u043B\u044F \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F \u0441\u0432\u044F\u0437\u043A\u0438 \u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E\u0433\u043E \u0433\u0440\u0430\u0444\u0438\u043A\u0430";
    strings["sensorsPack"] = "\u0421\u0432\u044F\u0437\u043A\u0430 \u0434\u0430\u0442\u0447\u0438\u043A\u043E\u0432";
    strings["connectLab"] = "\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u043B\u0430\u0431\u043E\u0440\u0430\u0442\u043E\u0440\u0438\u044E";
    strings["setModeError"] = "\u041E\u0448\u0438\u0431\u043A\u0430 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0438 \u0440\u0435\u0436\u0438\u043C\u0430 \u0434\u0430\u0442\u0447\u0438\u043A\u0430";
    strings["video_startStreamMessage"] = "\u041D\u0430\u0436\u043C\u0438\u0442\u0435 \u043D\u0430 \u043A\u043D\u043E\u043F\u043A\u0443, \u0447\u0442\u043E\u0431\u044B \u0432\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u043A\u0430\u043C\u0435\u0440\u0443";
    strings["camera"] = "\u041A\u0430\u043C\u0435\u0440\u0430";
    strings["offlineLogging_recordCount"] = "\u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u0437\u0430\u043F\u0438\u0441\u0435\u0439";
    strings["offlineLogging_button_start"] = "\u0417\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u0441\u0435\u0430\u043D\u0441 \u0430\u0432\u0442\u043E\u043D\u043E\u043C\u043D\u043E\u0439 \u0440\u0430\u0431\u043E\u0442\u044B";
    strings["offlineLogging_button_view"] = "\u0420\u0430\u0431\u043E\u0442\u0430 \u0441 \u0434\u0430\u043D\u043D\u044B\u043C\u0438 \u0441\u0435\u0430\u043D\u0441\u0430";
    strings["dots_many"] = "\u0442\u043E\u0447\u0435\u043A";
    strings["dots_few"] = "\u0442\u043E\u0447\u043A\u0438";
    strings["dots_one"] = "\u0442\u043E\u0447\u043A\u0430";
    strings["milliseconds_short"] = "\u043C\u0441";
    strings["seconds_short"] = "\u0441\u0435\u043A.";
    strings["minutes_short"] = "\u043C\u0438\u043D.";
    strings["hours_short"] = "\u0447.";
    strings["recording_interval"] = "\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B \u043C\u0435\u0436\u0434\u0443 \u0437\u0430\u043F\u0438\u0441\u044F\u043C\u0438";
    strings["offlineLogging_empty"] = "\u0421\u0435\u0430\u043D\u0441 \u0430\u0432\u0442\u043E\u043D\u043E\u043C\u043D\u043E\u0439 \u0440\u0430\u0431\u043E\u0442\u044B \u043D\u0435 \u0431\u044B\u043B \u043D\u0430\u0447\u0430\u0442";
    strings["offlineLogging_processing"] = "\u0417\u0430\u043F\u0443\u0449\u0435\u043D \u0441\u0435\u0430\u043D\u0441 \u0430\u0432\u0442\u043E\u043D\u043E\u043C\u043D\u043E\u0439 \u0440\u0430\u0431\u043E\u0442\u044B";
    strings["offlineLogging_loading"] = "\u0418\u0434\u0435\u0442 \u0441\u0431\u043E\u0440 \u0430\u0440\u0445\u0438\u0432\u0430";
    strings["offlineLogging_unknown"] = "\u0421\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u0430\u0440\u0445\u0438\u0432\u0430 \u043D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E";
    strings["offlineLogging_done"] = "\u0421\u0435\u0430\u043D\u0441 \u0430\u0432\u0442\u043E\u043D\u043E\u043C\u043D\u043E\u0439 \u0440\u0430\u0431\u043E\u0442\u044B \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D";
    strings["status"] = "\u0421\u0442\u0430\u0442\u0443\u0441";
    strings["offlineLogging_title"] = "\u0421\u0435\u0430\u043D\u0441 \u0430\u0432\u0442\u043E\u043D\u043E\u043C\u043D\u043E\u0439 \u0440\u0430\u0431\u043E\u0442\u044B";
    strings["offlineLogging_subtitle"] = "\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0435 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u044B \u0441\u0435\u0430\u043D\u0441\u0430 \u0430\u0432\u0442\u043E\u043D\u043E\u043C\u043D\u043E\u0439 \u0440\u0430\u0431\u043E\u0442\u044B";
    strings["calibrationNotSuccess"] = "\u041A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0430 \u043D\u0435 \u0431\u044B\u043B\u0430 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0430";
    strings["calibrationSuccess"] = "\u041A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0430 \u0431\u044B\u043B\u0430 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0430";
    strings["error"] = "\u041E\u0448\u0438\u0431\u043A\u0430!";
    strings["alert"] = "\u0412\u043D\u0438\u043C\u0430\u043D\u0438\u0435!";
    strings["retry"] = "\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C \u043F\u043E\u043F\u044B\u0442\u043A\u0443";
    strings["serverAddress"] = "\u0410\u0434\u0440\u0435\u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u0430";
    strings["connect"] = "\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u044C";
    strings["disconnect"] = "\u041E\u0442\u043A\u043B\u044E\u0447\u0438\u0442\u044C";
    strings["networkName"] = "\u0418\u043C\u044F \u0441\u0435\u0442\u0438";
    strings["password"] = "\u041F\u0430\u0440\u043E\u043B\u044C";
    strings["ipAddress"] = "IP \u0430\u0434\u0440\u0435\u0441";
    strings["gateway"] = "\u0428\u043B\u044E\u0437";
    strings["optional"] = "\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E";
    strings["showAdditionalSettings"] = "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0434\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438";
    strings["calibratedSensorValue"] = "\u041D\u043E\u0432\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435";
    strings["numberOfCalibrationSteps"] = "\u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u0441\u0442\u0443\u043F\u0435\u043D\u0435\u0439 \u043A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0438";
    strings["currentValue"] = "\u0422\u0435\u043A\u0443\u0449\u0435\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435";
    strings["calibrate"] = "\u041A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u0430\u0442\u044C";
    strings["reset"] = "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C";
    strings["calibrationSubtitle"] = "\u041A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0430 \u0434\u0430\u0442\u0447\u0438\u043A\u043E\u0432";
    strings["calibrationTitle"] = "\u041A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0430";
    strings["copy"] = "\u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C";
    strings["open"] = "\u041E\u0442\u043A\u0440\u044B\u0442\u044C";
    strings["cancel"] = "\u0417\u0430\u043A\u0440\u044B\u0442\u044C";
    strings["link"] = "\u0421\u0441\u044B\u043B\u043A\u0430";
    strings["archiveSavedTitle"] = "\u0414\u0430\u043D\u043D\u044B\u0435 \u0431\u044B\u043B\u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u044B.";
    strings["archiveSavedDescription"] = "\u0421\u043A\u043E\u043F\u0438\u0440\u0443\u0439\u0442\u0435 \u0441\u0441\u044B\u043B\u043A\u0443, \u0447\u0442\u043E\u0431\u044B \u043F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 \u0438\u043B\u0438 \u043F\u043E\u0434\u0435\u043B\u0438\u0442\u044C\u0441\u044F \u0438\u043C\u0438. \u0421\u0441\u044B\u043B\u043A\u0430 \u0430\u043A\u0442\u0443\u0430\u043B\u044C\u043D\u0430 1 \u043C\u0435\u0441\u044F\u0446.";
    strings["readSettingsError"] = "\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0441\u0447\u0438\u0442\u044B\u0432\u0430\u043D\u0438\u0438 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A";
    strings["graphicsTitle"] = "\u0413\u0440\u0430\u0444\u0438\u043A\u0438";
    strings["measuresTitle"] = "\u0418\u0437\u043C\u0435\u0440\u0435\u043D\u0438\u044F";
    strings["maxY"] = "M\u0430\u043A\u0441. Y";
    strings["maxX"] = "M\u0430\u043A\u0441. X";
    strings["apply"] = "\u041F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C";
    strings["confirm"] = "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C";
    strings["fixed"] = "\u0424\u0438\u043A\u0441\u0438\u0440\u043E\u0432\u0430\u0442\u044C";
    strings["noData"] = "\u043D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445";
    strings["time"] = "\u0412\u0440\u0435\u043C\u044F";
    strings["chartCrosshairValue"] = "\u0417\u043D\u0430\u0447\u0435\u043D\u0438\u0435: ";
    strings["chartCrosshairTime"] = "\u0412\u0440\u0435\u043C\u044F: ";
    strings["serverNotResponding"] = "\u0421\u0435\u0440\u0432\u0435\u0440 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F \u043D\u0435 \u043E\u0442\u0432\u0435\u0447\u0430\u0435\u0442";
    strings["fatalError"] = "\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430, \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u043F\u0435\u0440\u0435\u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443 \u0438 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E";
    strings["workWithSavedData_title"] = "\u041A\u0430\u0431\u0438\u043D\u0435\u0442 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0438 \u0434\u0430\u043D\u043D\u044B\u0445";
    strings["back"] = "\u041D\u0430\u0437\u0430\u0434";
    strings["chartCrosshairValues"] = "\u0417\u043D\u0430\u0447\u0435\u043D\u0438\u044F: ";
    strings["settings"] = "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438";
    strings["about"] = "\u041E \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u0435";
    strings["sensors"] = "\u0414\u0430\u0442\u0447\u0438\u043A\u0438";
    strings["connectSensors"] = "\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u0434\u0430\u0442\u0447\u0438\u043A\u043E\u0432";
    strings["experimentSettings"] = "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u044D\u043A\u0441\u043F\u0435\u0440\u0438\u043C\u0435\u043D\u0442\u0430";
    strings["support"] = "\u0422\u0435\u0445\u043D\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430";
    strings["aboutContactCellphone"] = "\u0422\u0435\u043B\u0435\u0444\u043E\u043D: <a href=\"tel:+78007753797\">8 (800) 775 37-97</a>";
    strings["site"] = "\u0421\u0430\u0439\u0442";
    strings["aboutSiteUrl"] = "www.zarnitza.ru";
    strings["sensorSettings"] = "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0434\u0430\u0442\u0447\u0438\u043A\u0430";
    strings["rangeAndUnit"] = "\u0414\u0438\u0430\u043F\u0430\u0437\u043E\u043D / \u0415\u0434. \u0438\u0437\u043C\u0435\u0440\u0435\u043D\u0438\u044F";
    strings["chartLineColor"] = "\u0426\u0432\u0435\u0442 \u043B\u0438\u043D\u0438\u0438 \u0433\u0440\u0430\u0444\u0438\u043A\u0430";
    strings["chartLineWidth"] = "\u0422\u043E\u043B\u0449\u0438\u043D\u0430 \u043B\u0438\u043D\u0438\u0438 \u0433\u0440\u0430\u0444\u0438\u043A\u0430";
    strings["chartMarkerColor"] = "\u0426\u0432\u0435\u0442 \u0442\u043E\u0447\u0435\u043A \u0433\u0440\u0430\u0444\u0438\u043A\u0430";
    strings["chartMarkerWidth"] = "\u0420\u0430\u0437\u043C\u0435\u0440 \u0442\u043E\u0447\u0435\u043A \u0433\u0440\u0430\u0444\u0438\u043A\u0430";
    strings["start"] = "\u041F\u0443\u0441\u043A";
    strings["stop"] = "\u041E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C";
    strings["experimentTimeLabel"] = "\u0412\u0440\u0435\u043C\u044F \u044D\u043A\u0441\u043F\u0435\u0440\u0438\u043C\u0435\u043D\u0442\u0430";
    strings["timeFormatLabel"] = "\u0424\u043E\u0440\u043C\u0430\u0442 \u0432\u0440\u0435\u043C\u0435\u043D\u0438";
    strings["timeSecond"] = "\u0421\u0435\u043A\u0443\u043D\u0434";
    strings["timeMinute"] = "\u041C\u0438\u043D\u0443\u0442";
    strings["modeStopwatch"] = "\u0421\u0435\u043A\u043D\u0443\u0434\u043E\u043C\u0435\u0440";
    strings["modeMinutesSecondsMs"] = "\u041C\u0438\u043D\u0443\u0442\u044B, \u0441\u0435\u043A\u0443\u043D\u0434\u044B, \u043C\u0438\u043B\u043B\u0438\u0441\u0435\u043A\u0443\u043D\u0434\u044B";
    strings["modeHoursMinutesSeconds"] = "\u0427\u0430\u0441\u044B, \u043C\u0438\u043D\u0443\u0442\u044B, \u0441\u0435\u043A\u0443\u043D\u0434\u044B";
    strings["experimentIsDone"] = "\u042D\u043A\u0441\u043F\u0435\u0440\u0438\u043C\u0435\u043D\u0442 \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043D";
    strings["exitFromDashboardText"] = "\u0412\u044B \u0443\u0432\u0435\u0440\u0435\u043D\u044B, \u0447\u0442\u043E \u0445\u043E\u0442\u0438\u0442\u0435 \u0437\u0430\u0432\u0435\u0440\u0438\u0448\u0442\u044C \u044D\u043A\u0441\u043F\u0435\u0440\u0438\u043C\u0435\u043D\u0442?<br><b>\u0412\u043D\u0438\u043C\u0430\u043D\u0438\u0435!</b> \u0412\u0441\u0435 \u043D\u0435\u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 \u0431\u0443\u0434\u0443\u0442 \u043F\u043E\u0442\u0435\u0440\u044F\u043D\u044B";
    strings["yes"] = "\u0414\u0430";
    strings["no"] = "\u041D\u0435\u0442";
    strings["reject"] = "\u041E\u0442\u043C\u0435\u043D\u0430";
    strings["exitFromDashboardTitle"] = "<b>\u0412\u044B\u0445\u043E\u0434 \u0438\u0437 \u0440\u0435\u0436\u0438\u043C\u0430 \u0438\u0437\u043C\u0435\u0440\u0435\u043D\u0438\u044F</b>";
    strings["wifiSettings"] = "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0441\u0435\u0442\u0438";
    strings["loadFailedHeader"] = "\u0412\u043D\u0438\u043C\u0430\u043D\u0438\u0435";
    strings["loadFailedBody"] = "\u0412\u043E \u0432\u0440\u0435\u043C\u044F \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u043F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430. \u0414\u0430\u043D\u043D\u044B\u0435 \u043D\u0435 \u0431\u044B\u043B\u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u044B!";
    strings["disabled"] = "\u041E\u0442\u043A\u043B\u044E\u0447\u0435\u043D";
    strings["timeFormatStopwatch"] = "\u0441\u0441.\u043C\u0441";
    strings["timeFormatMinutesSecondsMs"] = "\u043C\u043C:\u0441\u0441.\u043C\u0441";
    strings["timeFormatHoursMinutesSeconds"] = "\u0447\u0447:\u043C\u043C:\u0441\u0441";
    strings["calibrateEqualsError"] = "\u0417\u043D\u0430\u0447\u0435\u043D\u0438\u044F \u043F\u0435\u0440\u0432\u043E\u0433\u043E \u0438 \u0432\u0442\u043E\u0440\u043E\u0433\u043E \u0448\u0430\u0433\u0430 \u0434\u043E\u043B\u0436\u043D\u044B \u043E\u0442\u043B\u0438\u0447\u0430\u0442\u044C\u0441\u044F!";
    strings["unknownError"] = "\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u0430\u044F \u043E\u0448\u0438\u0431\u043A\u0430";
    strings["inputMustBeANumber"] = "\u0417\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C \u0447\u0438\u0441\u043B\u043E\u043C";
    strings["unknownLabTypeError"] = "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439 \u0442\u0438\u043F \u043B\u0430\u0431\u043E\u0440\u0430\u0442\u043E\u0440\u0438\u0438";
    strings["deviceSelectionError"] = "\u0423\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E \u043D\u0435 \u0431\u044B\u043B\u043E \u0432\u044B\u0431\u0440\u0430\u043D\u043E";
    strings["usbPortAlreadyOpenedError"] = "\u0423\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E \u0443\u0436\u0435 \u0431\u044B\u043B\u043E \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u043E. \u0417\u0430\u043A\u0440\u043E\u0439\u0442\u0435 \u0432\u0441\u0435 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u044B \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u044E\u0449\u0438\u0435 \u044D\u0442\u043E \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E";
    strings["parseError"] = "\u041E\u0448\u0438\u0431\u043A\u0430 \u0440\u0430\u0437\u0431\u043E\u0440\u0430 \u0434\u0430\u043D\u043D\u044B\u0445";
    strings["notResponseError"] = "\u0423\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E \u043D\u0435 \u043E\u0442\u0432\u0435\u0447\u0430\u0435\u0442";
    strings["deviceDisconnectedMessage"] = "\u0423\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E \u0431\u044B\u043B\u043E \u043E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u043E";
    strings["unknownDevice"] = "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E\u0435 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E";
    strings["calibration_passwordError"] = "\u041D\u0435 \u0432\u0435\u0440\u043D\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C!";
    strings["worksheetName"] = "\u0418\u0437\u043C\u0435\u0440\u0435\u043D\u0438\u044F";
    strings["exportExperimentTableFileName"] = "\u0418\u0437\u043C\u0435\u0440\u0435\u043D\u0438\u044F";
    strings["exportExperimentImageFileName"] = "\u0418\u0437\u043C\u0435\u0440\u0435\u043D\u0438\u044F";
    strings["exportCameraImageFileName"] = "\u0424\u043E\u0442\u043E \u044D\u043A\u0441\u043F\u0435\u0440\u0438\u043C\u0435\u043D\u0442\u0430";
    strings["exportCameraVideoFileName"] = "\u0417\u0430\u043F\u0438\u0441\u044C \u044D\u043A\u0441\u043F\u0435\u0440\u0438\u043C\u0435\u043D\u0442\u0430";
    strings["update"] = "\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C";
    strings["quitAndUpdate"] = "\u0412\u044B\u0439\u0442\u0438 \u0438 \u043E\u0431\u043D\u043E\u0432\u0438\u0442\u044C";
    strings["later"] = "\u041F\u043E\u0437\u0436\u0435";
    strings["AP_status_0"] = "\u0418\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044F";
    strings["AP_status_1"] = "\u0423\u0441\u0440\u0435\u0434\u043D\u0435\u043D\u0438\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0439. \u041F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0430";
    strings["AP_status_2"] = "\u041E\u0436\u0438\u0434\u0430\u043D\u0438\u0435 \u043D\u0430\u043A\u0430\u0447\u043A\u0438";
    strings["AP_status_3"] = "\u041D\u0430\u043A\u0430\u0447\u0438\u0432\u0430\u043D\u0438\u0435";
    strings["AP_status_4"] = "\u041D\u0430\u043A\u0430\u0447\u0438\u0432\u0430\u043D\u0438\u0435 \u043E\u043A\u043E\u043D\u0447\u0435\u043D\u043E";
    strings["AP_status_5"] = "\u0418\u0437\u043C\u0435\u0440\u0435\u043D\u0438\u0435";
    strings["AP_status_6"] = "\u0420\u0430\u0441\u0447\u0435\u0442 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0439";
    strings["AP_error_0"] = "\u041E\u0436\u0438\u0434\u0430\u043D\u0438\u0435";
    strings["AP_error_1"] = "\u041E\u0448\u0438\u0431\u043A\u0430 1";
    strings["AP_error_2"] = "\u041E\u0448\u0438\u0431\u043A\u0430 2";
    strings["AP_error_3"] = "\u041E\u0448\u0438\u0431\u043A\u0430 3";
    strings["AP_error_4"] = "\u041E\u0448\u0438\u0431\u043A\u0430 4";
    strings["AP_error_5"] = "\u041E\u0448\u0438\u0431\u043A\u0430 5";
    strings["AP_error_6"] = "\u0418\u0437\u043C\u0435\u0440\u0435\u043D\u0438\u0435 \u0443\u0441\u043F\u0435\u0448\u043D\u043E";
    strings["couldNotConnectToServer"] = "\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u043A \u043E\u0431\u043B\u0430\u043A\u0443 \u043D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C, \u043F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u0432\u0432\u0435\u0434\u0435\u043D\u043D\u044B\u0445 \u0434\u0430\u043D\u043D\u044B\u0445.";
    strings["successConnectToServer"] = "\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u043A \u043E\u0431\u043B\u0430\u043A\u0443 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043E!";
    strings["disconnectLab"] = "\u041E\u0442\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u043B\u0430\u0431\u043E\u0440\u0430\u0442\u043E\u0440\u0438\u044E";
})(strings || (strings = {}));
var interpolatedStrings;
(function (interpolatedStrings) {
    interpolatedStrings["deviceDisconnectedMessage"] = "\u0423\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E {0} \u0431\u044B\u043B\u043E \u043E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u043E";
    interpolatedStrings["realValueStep"] = "\u0424\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 (\u0441\u0442\u0443\u043F\u0435\u043D\u044C&nbsp;\u2116{0})";
})(interpolatedStrings || (interpolatedStrings = {}));
var strings$1 = strings;

class SensorMode {
    static Disabled = new SensorMode({
        minValue: 0,
        maxValue: 0,
        unit: '',
        customStringRepresentation: strings$1.disabled,
        accuracy: 0,
        calibrationSteps: new CalibrationSteps(0, 0)
    });
    minValue;
    maxValue;
    unit;
    accuracy;
    calibrationSteps;
    customStringRepresentation;
    constructor({ minValue, maxValue, unit, customStringRepresentation, accuracy, calibrationSteps }) {
        this.customStringRepresentation = customStringRepresentation || '';
        this.unit = unit;
        this.maxValue = maxValue;
        this.minValue = minValue;
        this.accuracy = accuracy;
        this.calibrationSteps = calibrationSteps;
    }
    toString() {
        return this.customStringRepresentation || `${this.minValue}...${this.maxValue} ${this.unit}`;
    }
}

const USB_SENSORS_PREFERENCES = new Map([
    [
        SensorType.OscilloscopeSensor,
        {
            name: 'Осциллограф',
            defaultCalibrationSteps: new CalibrationSteps(0, 0),
            modes: [
                new SensorMode({
                    minValue: -2000,
                    maxValue: 2000,
                    unit: 'В',
                    accuracy: 2,
                }),
            ],
            vendorId: 0x0483,
            productId: 0x5740,
            ico: 'Oscill.png'

        }
    ],
    [
        SensorType.ColorimeterSensor,
        {
            name: 'Датчик оптической плотности',
            vendorId: 0xC0DE,
            productId: 0xDB64,
            defaultCalibrationSteps: CalibrationSteps.Automated,
            modes: [
                new SensorMode({ minValue: 0, maxValue: 2, unit: 'D', accuracy: 2 }),
            ],
            ico: 'Colorimeter.png',
        },
    ],
    [
        SensorType.OpticalDensitySensor,
        {
            name: 'Датчик оптической плотности и мутности',
            defaultCalibrationSteps: new CalibrationSteps(-1, -1),
            modes: [
                new SensorMode({
                    minValue: 0,
                    maxValue: 2,
                    unit: 'D',
                    accuracy: 2,
                    customStringRepresentation: 'датчик оптической плотности 470 нм',
                }),
                new SensorMode({
                    minValue: 0,
                    maxValue: 2,
                    unit: 'D',
                    accuracy: 2,
                    customStringRepresentation: 'датчик оптической плотности 525 нм',
                }),
                new SensorMode({
                    minValue: 0,
                    maxValue: 2,
                    unit: 'D',
                    accuracy: 2,
                    customStringRepresentation: 'датчик оптической плотности 630 нм',
                }),
                new SensorMode({
                    minValue: 0,
                    maxValue: 200,
                    unit: 'NTU',
                    accuracy: 0,
                    customStringRepresentation: 'датчик мутности',
                    calibrationSteps: new CalibrationSteps(2, 2),
                }),
            ],
            vendorId: 0xC0DE,
            productId: 0xDB65,
            ico: 'OpticalDensitySensor.png',

        },
    ],
    [
        SensorType.SoilMoistureSensor,
        {
            name: 'Датчик влажности почвы',
            defaultCalibrationSteps: new CalibrationSteps(2, 2),
            modes: [
                new SensorMode({
                    minValue: 0,
                    maxValue: 50,
                    unit: '%',
                    accuracy: 1,
                }),
            ],
            vendorId: 0xC0DE,
            productId: 0xDB66,
            ico: 'SoilMoistureSensor.png',

        },
    ],
    [
        SensorType.SoundSensor,
        {
            name: 'Датчик звука',
            defaultCalibrationSteps: new CalibrationSteps(0, 0),
            modes: [
                new SensorMode({
                    minValue: -2000,
                    maxValue: 2000,
                    accuracy: 0,
                    unit: 'мПа',
                }),
            ],
            vendorId: 0xC0DE,
            productId: 0xDB67,
            ico: 'SoundSensor.png',
        },
    ],
    [
        SensorType.CoSensor,
        {
            name: 'Датчик CO',
            defaultCalibrationSteps: new CalibrationSteps(2, 2),
            modes: [
                new SensorMode({
                    minValue: 0,
                    maxValue: 1000,
                    unit: 'ppm',
                    accuracy: 0,
                }),
            ],
            vendorId: 0xC0DE,
            productId: 0xDB68,

            ico: 'CoSensor.png',
        },
    ],
    [
        SensorType.UsbLightSensor,
        {
            name: 'Датчик освещенности',
            defaultCalibrationSteps: new CalibrationSteps(1, 1),
            vendorId: 0xC0DE,
            modes: [
                new SensorMode({
                    minValue: 0,
                    maxValue: 190000,
                    unit: 'лк',
                    accuracy: 0,
                }),
            ],
            productId: 0xDB69,
            ico: 'Illumination.png',

        },
    ],
    [
        SensorType.CardioSensor,
        {
            name: 'Электрокардиограф',
            defaultCalibrationSteps: new CalibrationSteps(0, 0),
            modes: [
                new SensorMode({
                    minValue: -300,
                    maxValue: 300,
                    accuracy: 0,
                    unit: 'мВ',
                }),
            ],
            vendorId: 0xC0DE,
            productId: 0xDB6A,
            ico: 'Cardio.png',
        },
    ],
    [
        SensorType.WristSensor,
        {
            name: 'Датчик кистевой силы',
            defaultCalibrationSteps: new CalibrationSteps(2, 2),
            modes: [
                new SensorMode({
                    minValue: 0,
                    maxValue: 50,
                    unit: 'H',
                    accuracy: 2,
                }),
            ],
            vendorId: 0xC0DE,
            productId: 0xDB6B,
            ico: 'WristSensor.png',
        },
    ]
]);

exports.USB_SENSORS_PREFERENCES = USB_SENSORS_PREFERENCES;
