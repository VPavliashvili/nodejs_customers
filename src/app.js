"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const customer_js_1 = __importDefault(require("./models/customer.js"));
if (process.env.NODE_ENV !== "production") {
    dotenv_1.default.config();
}
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const CONNECTION = (_a = process.env.CONNECTION) !== null && _a !== void 0 ? _a : "";
mongoose_1.default.set("strictQuery", false);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (_req, res) => {
    res.send("Welcome to home page");
});
app.get("/api/customers/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield customer_js_1.default.find();
        res.send({ customers: result });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
}));
app.get("/api/customers/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: customerId } = req.params;
        const customer = yield customer_js_1.default.findById(customerId);
        if (!customer) {
            res.status(404).json({ error: "customer not found" });
        }
        else {
            res.json({ customer });
        }
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
}));
app.get("/api/orders/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.id;
        req.body._id = orderId;
        const result = yield customer_js_1.default.findOne({ "orders._id": orderId });
        console.log(result);
        if (result) {
            res.json({ result });
        }
        else {
            res.status(404).json({ error: "order not found" });
        }
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
}));
app.put("/api/customers/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerId = req.params.id;
        const result = yield customer_js_1.default.findOneAndReplace({ _id: customerId }, req.body, { new: true });
        console.log(result);
        res.json({ customer: result });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
}));
app.patch("/api/customers/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerId = req.params.id;
        const result = yield customer_js_1.default.findOneAndUpdate({ _id: customerId }, req.body, { new: true });
        console.log(result);
        res.json({ customer: result });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
}));
app.patch("/api/orders/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.id;
        req.body._id = orderId;
        const result = yield customer_js_1.default.findOneAndUpdate({ "orders._id": orderId }, { $set: { "orders.$": req.body } }, { new: true });
        if (result) {
            res.json(result);
        }
        else {
            res.status(404).json({ error: "something went wrong" });
        }
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
}));
app.delete("/api/customers/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerId = req.params.id;
        const result = yield customer_js_1.default.deleteOne({ _id: customerId });
        console.log(result);
        res.json({ deletedCount: result.deletedCount });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
}));
app.post("/api/customers/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = new customer_js_1.default(req.body);
    try {
        yield customer.save();
        console.log(customer);
        res.status(201).json({ customer });
    }
    catch (e) {
        res.status(400).json({ error: e.message });
    }
}));
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(CONNECTION);
        app.listen(PORT, () => {
            console.log("app listening on port -> " + PORT);
        });
    }
    catch (err) {
        console.log(err.message);
    }
});
start();
