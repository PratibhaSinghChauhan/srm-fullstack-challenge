const express = require("express");
const cors = require("cors");

const { processData } = require("./logic");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/bfhl", (req, res) => {
  try {
    const { data } = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({
        error: "data must be an array"
      });
    }

    const result = processData(data);

    res.json(result);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Internal Server Error"
    });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});