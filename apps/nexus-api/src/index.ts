import app from "./app.js";
import { configs } from "./configs/configs.js";

const port = configs.port;

// listen
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});