"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminApi = void 0;
var server_1 = require("@clerk/nextjs/server");
// Base API configuration
var API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
var AdminApiService = /** @class */ (function () {
    function AdminApiService() {
    }
    AdminApiService.prototype.getAuthHeaders = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, userId, sessionClaims, role, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, server_1.auth)()];
                    case 1:
                        _a = _b.sent(), userId = _a.userId, sessionClaims = _a.sessionClaims;
                        if (!userId) {
                            throw new Error('Not authenticated');
                        }
                        role = (sessionClaims === null || sessionClaims === void 0 ? void 0 : sessionClaims.metadata) && typeof sessionClaims.metadata === 'object'
                            ? sessionClaims.metadata.role || 'user'
                            : 'user';
                        return [2 /*return*/, {
                                'Content-Type': 'application/json',
                                'X-User-Id': userId,
                                'X-User-Role': role
                            }];
                    case 2:
                        error_1 = _b.sent();
                        console.error('Failed to get auth token:', error_1);
                        return [2 /*return*/, {
                                'Content-Type': 'application/json',
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AdminApiService.prototype.request = function (endpoint_1) {
        return __awaiter(this, arguments, void 0, function (endpoint, options) {
            var headers, response_1, errorData, error_2;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.getAuthHeaders()];
                    case 1:
                        headers = _a.sent();
                        return [4 /*yield*/, fetch("".concat(API_BASE_URL).concat(endpoint), __assign(__assign({}, options), { headers: __assign(__assign({}, headers), options.headers) }))];
                    case 2:
                        response_1 = _a.sent();
                        if (!!response_1.ok) return [3 /*break*/, 4];
                        return [4 /*yield*/, response_1.json().catch(function () { return ({
                                message: "HTTP ".concat(response_1.status, ": ").concat(response_1.statusText),
                            }); })];
                    case 3:
                        errorData = _a.sent();
                        throw new Error(errorData.message || 'API request failed');
                    case 4: return [4 /*yield*/, response_1.json()];
                    case 5: return [2 /*return*/, _a.sent()];
                    case 6:
                        error_2 = _a.sent();
                        console.error("API request failed for ".concat(endpoint, ":"), error_2);
                        throw error_2;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    // Dashboard APIs
    AdminApiService.prototype.getDashboardMetrics = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request('/admin/dashboard/metrics')];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    // Users APIs
    AdminApiService.prototype.getUsers = function () {
        return __awaiter(this, arguments, void 0, function (params) {
            var queryParams;
            if (params === void 0) { params = {}; }
            return __generator(this, function (_a) {
                queryParams = new URLSearchParams();
                Object.entries(params).forEach(function (_a) {
                    var key = _a[0], value = _a[1];
                    if (value !== undefined && (typeof value === 'string' ? value !== '' : true)) {
                        queryParams.append(key, value.toString());
                    }
                });
                return [2 /*return*/, this.request("/admin/users?".concat(queryParams.toString()))];
            });
        });
    };
    AdminApiService.prototype.getUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request("/admin/users/".concat(id))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    AdminApiService.prototype.updateUser = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request("/admin/users/".concat(id), {
                            method: 'PUT',
                            body: JSON.stringify(data),
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    AdminApiService.prototype.deleteUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request("/admin/users/".concat(id), {
                            method: 'DELETE',
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Transactions APIs
    AdminApiService.prototype.getTransactions = function () {
        return __awaiter(this, arguments, void 0, function (params) {
            var queryParams;
            if (params === void 0) { params = {}; }
            return __generator(this, function (_a) {
                queryParams = new URLSearchParams();
                Object.entries(params).forEach(function (_a) {
                    var key = _a[0], value = _a[1];
                    if (value !== undefined && value !== '') {
                        queryParams.append(key, value.toString());
                    }
                });
                return [2 /*return*/, this.request("/admin/transactions?".concat(queryParams.toString()))];
            });
        });
    };
    AdminApiService.prototype.getTransaction = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request("/admin/transactions/".concat(id))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    AdminApiService.prototype.updateTransactionStatus = function (id, status, reason) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request("/admin/transactions/".concat(id), {
                            method: 'PUT',
                            body: JSON.stringify({ status: status, reason: reason }),
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    AdminApiService.prototype.refundTransaction = function (id, reason) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request("/admin/transactions/".concat(id, "/refund"), {
                            method: 'POST',
                            body: JSON.stringify({ reason: reason }),
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    // Support APIs
    AdminApiService.prototype.getSupportTickets = function () {
        return __awaiter(this, arguments, void 0, function (params) {
            var queryParams;
            if (params === void 0) { params = {}; }
            return __generator(this, function (_a) {
                queryParams = new URLSearchParams();
                Object.entries(params).forEach(function (_a) {
                    var key = _a[0], value = _a[1];
                    if (value !== undefined && (typeof value === 'string' ? value !== '' : true)) {
                        queryParams.append(key, value.toString());
                    }
                });
                return [2 /*return*/, this.request("/admin/support/tickets?".concat(queryParams.toString()))];
            });
        });
    };
    AdminApiService.prototype.getSupportTicket = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request("/admin/support/tickets/".concat(id))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    AdminApiService.prototype.updateSupportTicket = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request("/admin/support/tickets/".concat(id), {
                            method: 'PUT',
                            body: JSON.stringify(data),
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    AdminApiService.prototype.replyToTicket = function (id, message) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request("/admin/support/tickets/".concat(id, "/reply"), {
                            method: 'POST',
                            body: JSON.stringify({ message: message }),
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Notifications APIs
    AdminApiService.prototype.getNotifications = function () {
        return __awaiter(this, arguments, void 0, function (params) {
            var queryParams;
            if (params === void 0) { params = {}; }
            return __generator(this, function (_a) {
                queryParams = new URLSearchParams();
                Object.entries(params).forEach(function (_a) {
                    var key = _a[0], value = _a[1];
                    if (value !== undefined && (typeof value === 'string' ? value !== '' : true)) {
                        queryParams.append(key, value.toString());
                    }
                });
                return [2 /*return*/, this.request("/admin/notifications?".concat(queryParams.toString()))];
            });
        });
    };
    AdminApiService.prototype.markNotificationAsRead = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request("/admin/notifications/".concat(id, "/read"), {
                            method: 'PATCH',
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AdminApiService.prototype.markAllNotificationsAsRead = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request('/admin/notifications/read-all', {
                            method: 'PATCH',
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Analytics APIs
    AdminApiService.prototype.getAnalytics = function () {
        return __awaiter(this, arguments, void 0, function (params) {
            var queryParams, response;
            if (params === void 0) { params = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryParams = new URLSearchParams();
                        Object.entries(params).forEach(function (_a) {
                            var key = _a[0], value = _a[1];
                            if (value !== undefined && (typeof value === 'string' ? value !== '' : true)) {
                                queryParams.append(key, value.toString());
                            }
                        });
                        return [4 /*yield*/, this.request("/admin/analytics?".concat(queryParams.toString()))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    return AdminApiService;
}());
// Export singleton instance
exports.adminApi = new AdminApiService();
exports.default = exports.adminApi;
