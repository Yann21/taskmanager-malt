const express = require("express");
const bodyParser = require("body-parser");
const kanbanRoutes = require("./routes/kanbanRoutes");
const taskRoutes = require("./routes/taskRoutes");
const listRoutes = require("./routes/listRoutes");

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use("/api/kanbans", kanbanRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/lists", listRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
