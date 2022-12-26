const app = require("./src/app");
const logger = require("./src/logger/logger");
require("dotenv").config();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  logger.info(`Server is listening on http://localhost:${PORT}`);
});
