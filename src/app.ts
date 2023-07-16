import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Customer from "./models/customer.js";
import { Request, Response } from "express";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();
const PORT = process.env.PORT || 3000;
const CONNECTION: string = process.env.CONNECTION ?? "";

mongoose.set("strictQuery", false);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  res.send("Welcome to home page");
});

app.get("/api/customers/", async (_req: Request, res: Response) => {
  try {
    const result = await Customer.find();
    res.send({ customers: result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/customers/:id", async (req: Request, res: Response) => {
  try {
    const { id: customerId } = req.params;
    const customer = await Customer.findById(customerId);
    if (!customer) {
      res.status(404).json({ error: "customer not found" });
    } else {
      res.json({ customer });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/orders/:id", async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;
    req.body._id = orderId;
    const result = await Customer.findOne({ "orders._id": orderId });
    console.log(result);
    if (result) {
      res.json({ result });
    } else {
      res.status(404).json({ error: "order not found" });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put("/api/customers/:id", async (req: Request, res: Response) => {
  try {
    const customerId = req.params.id;
    const result = await Customer.findOneAndReplace(
      { _id: customerId },
      req.body,
      { new: true }
    );
    console.log(result);
    res.json({ customer: result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.patch("/api/customers/:id", async (req: Request, res: Response) => {
  try {
    const customerId = req.params.id;
    const result = await Customer.findOneAndUpdate(
      { _id: customerId },
      req.body,
      { new: true }
    );
    console.log(result);
    res.json({ customer: result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.patch("/api/orders/:id", async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;
    req.body._id = orderId;
    const result = await Customer.findOneAndUpdate(
      { "orders._id": orderId },
      { $set: { "orders.$": req.body } },
      { new: true }
    );
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: "something went wrong" });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete("/api/customers/:id", async (req: Request, res: Response) => {
  try {
    const customerId = req.params.id;
    const result = await Customer.deleteOne({ _id: customerId });
    console.log(result);
    res.json({ deletedCount: result.deletedCount });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/customers/", async (req: Request, res: Response) => {
  const customer = new Customer(req.body);
  try {
    await customer.save();
    console.log(customer);
    res.status(201).json({ customer });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

const start = async () => {
  try {
    await mongoose.connect(CONNECTION);

    app.listen(PORT, () => {
      console.log("app listening on port -> " + PORT);
    });
  } catch (err) {
    console.log(err.message);
  }
};
start();
