// Stand-in for the real form backend during end-to-end tests.
// POST /hook records a submission; GET /hits lists them; POST /mode {"fail": true} makes /hook return 500.
import http from "node:http";

const port = Number(process.env.MOCK_WEBHOOK_PORT || 4590);
let hits = [];
let fail = false;

function readBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => resolve(body));
  });
}

http
  .createServer(async (req, res) => {
    const body = await readBody(req);
    const send = (status, data) => {
      res.writeHead(status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data));
    };

    if (req.method === "POST" && req.url === "/hook") {
      if (fail) return send(500, { ok: false });
      hits.push({ secret: req.headers["x-webhook-secret"] ?? null, payload: JSON.parse(body) });
      return send(200, { ok: true });
    }
    if (req.method === "GET" && req.url === "/hits") return send(200, hits);
    if (req.method === "POST" && req.url === "/reset") {
      hits = [];
      fail = false;
      return send(200, { ok: true });
    }
    if (req.method === "POST" && req.url === "/mode") {
      fail = Boolean(JSON.parse(body || "{}").fail);
      return send(200, { fail });
    }
    if (req.method === "GET" && req.url === "/health") return send(200, { ok: true });
    send(404, { error: "not found" });
  })
  .listen(port, "127.0.0.1");
