const winston = require("winston");
const ecsFormat = require("@elastic/ecs-winston-format");

const logger = winston.createLogger({
  level: "debug",
  format: ecsFormat({ convertReqRes: true }),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs/log.json",
      level: "debug",
    }),
  ],
});

logger.info("starting nodejs app");

let count = 0;

setInterval(() => {
  ++count;
  logger.info("counting", { count });
}, 1000);
