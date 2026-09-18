import { app } from "./app.js";
import { config } from "./config.js";

app.listen(config.port, () => {
  console.log(`AI tech test API listening on port ${config.port}`);
});
