"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("@core/services");
const controller_1 = require("./controller");
const mac_files_service_1 = require("./services/mac-files.service");
const getOS = () => process.platform;
const OSService = {
    linux: services_1.LinuxFilesService,
    win32: services_1.WindowsFilesService,
    darwin: mac_files_service_1.MacFilesService,
};
const streamService = new services_1.StreamService();
const fileService = new OSService[getOS()](streamService);
exports.controller = new controller_1.Controller(fileService, new services_1.SpinnerService(), new services_1.ConsoleService(), new services_1.UpdateService(new services_1.HttpsService()), new services_1.ResultsService());
