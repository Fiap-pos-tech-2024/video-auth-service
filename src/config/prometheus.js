const client = require("prom-client");

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestDurationSeconds = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.5, 1, 1.5, 2, 5],
});
register.registerMetric(httpRequestDurationSeconds);

const totalRequests = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});
register.registerMetric(totalRequests);

const requestFailures = new client.Counter({
  name: "http_requests_errors_total",
  help: "Total number of failed HTTP requests",
  labelNames: ["method", "route", "status_code"],
});
register.registerMetric(requestFailures);

const metricsMiddleware = (req, res, next) => {
  if (req.path === "/metrics") return next();

  const end = httpRequestDurationSeconds.startTimer();

  res.on("finish", () => {
    const baseUrl = req.baseUrl || '';
    const routePath = req.route?.path || '';
    const route = `${baseUrl}${routePath}` || req.path || 'unknown_route';

    end({
      method: req.method,
      route,
      status_code: res.statusCode,
    });

    totalRequests.inc({
      method: req.method,
      route,
      status_code: res.statusCode,
    });

    if (res.statusCode >= 400) {
      requestFailures.inc({
        method: req.method,
        route,
        status_code: res.statusCode,
      });
    }
  });

  next();
};

module.exports = {
  metricsMiddleware,
  register,
};
