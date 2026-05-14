// Intentionally minimal and slightly insecure demo API

const express = require("express");
const _ = require("lodash");
const AWS = require("aws-sdk");
const moment = require("moment");
const request = require("request");
const marked = require("marked");
const serialize = require("serialize-javascript");
require("dotenv").config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const REGION = process.env.AWS_REGION || "us-east-1";
const BUCKET = process.env.APP_BUCKET || "bild-pdm-demo-change-me";

AWS.config.update({ region: REGION });
const s3 = new AWS.S3();

// NOTE: This endpoint echoes back merged query/body (risky pattern for demo)
app.post("/merge", (req, res) => {
  const base = { role: "user" };
  const merged = _.merge({}, base, req.body || {});
  res.json({ merged });
});

// List objects in the demo bucket (requires s3:ListBucket)
app.get("/files", async (req, res) => {
  try {
    const data = await s3
      .listObjectsV2({ Bucket: BUCKET, MaxKeys: 10 })
      .promise();
    res.json({ files: (data.Contents || []).map((o) => o.Key) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload a tiny text file (requires s3:PutObject)
app.post("/files/:key", async (req, res) => {
  try {
    const key = req.params.key;
    const body = JSON.stringify({ ts: Date.now() });
    await s3.putObject({ Bucket: BUCKET, Key: key, Body: body }).promise();
    res.json({ ok: true, key });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint using vulnerable moment.js for date formatting
app.get("/time", (req, res) => {
  const format = req.query.format || "YYYY-MM-DD";
  const now = moment().format(format);
  res.json({ timestamp: now, note: "Using deprecated moment.js" });
});

// Endpoint using vulnerable marked for markdown processing
app.post("/markdown", (req, res) => {
  const markdown = req.body.content || "# Default content";
  const html = marked(markdown);
  res.json({ html, warning: "Unsanitized markdown processing" });
});

// Endpoint using vulnerable serialize-javascript
app.get("/config", (req, res) => {
  const config = { env: "demo", timestamp: Date.now() };
  const serialized = serialize(config);
  res.json({ serialized, note: "Using vulnerable serialize-javascript" });
});

// Endpoint making external requests with deprecated request module
app.get("/proxy/:url", (req, res) => {
  const url = decodeURIComponent(req.params.url);
  request(url, (error, response, body) => {
    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.json({ status: response.statusCode, preview: body.slice(0, 100) });
    }
  });
});

app.listen(PORT, () =>
  console.log(`Demo API listening on http://localhost:${PORT}`)
);
