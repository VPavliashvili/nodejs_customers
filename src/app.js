import express from "express";
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const customers = [
  {
    name: "name1",
    industry: "industry1",
  },
  {
    name: "name2",
    industry: "industry2",
  },
  {
    name: "name3",
    industry: "industry3",
  },
];

app.get("/", (req, res) => {
  res.send("Welcome to home page");
});

app.get("/api/customers/", (req, res) => {
  res.send({ customers });
});

app.post("/api/customers/", (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

app.listen(PORT, () => {
  console.log("app listening on port -> " + PORT);
});
