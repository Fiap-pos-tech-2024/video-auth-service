const client = require("prom-client");

client.collectDefaultMetrics();

const httpRequestDurationSeconds = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "code"],
  buckets: [0.1, 0.5, 1, 1.5, 2, 5],
});

const metricsMiddleware = (req, res, next) => {
  if (req.path === "/metrics") {
    return next();
  }
  const end = httpRequestDurationSeconds.startTimer();
  res.on("finish", () => {
    end({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      code: res.statusCode,
    });
  });
  next();
};

const register = client.register;

module.exports = { metricsMiddleware, register };
