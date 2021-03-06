"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const GalleryInterfaces_1 = require("azure-devops-node-api/interfaces/GalleryInterfaces");
const viewutils_1 = require("./viewutils");
const pageSize = 100;
function search(searchText, json = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const flags = [];
        const api = util_1.getPublicGalleryAPI();
        const results = yield api.extensionQuery({
            pageSize,
            criteria: [
                { filterType: GalleryInterfaces_1.ExtensionQueryFilterType.SearchText, value: searchText },
            ],
            flags,
        });
        if (json) {
            console.log(JSON.stringify(results, undefined, '\t'));
            return;
        }
        if (!results.length) {
            console.log('No matching results');
            return;
        }
        console.log([
            `Search results:`,
            '',
            ...viewutils_1.tableView([
                ['<ExtensionId>', '<Description>'],
                ...results.map(({ publisher: { publisherName }, extensionName, shortDescription }) => [publisherName + '.' + extensionName, (shortDescription || '').replace(/\n|\r|\t/g, ' ')])
            ]),
            '',
            'For more information on an extension use "vsce show <extensionId>"',
        ]
            .map(line => viewutils_1.wordTrim(line.replace(/\s+$/g, '')))
            .join('\n'));
    });
}
exports.search = search;
