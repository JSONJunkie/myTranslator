const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

app.use(express.json({ extended: false }));

// Define Routes
app.use("/api/translator", require("./routes/api/translator"));
