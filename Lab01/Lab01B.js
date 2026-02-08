const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const filename = "lala.html";

const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, filename);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end("<h1>404</h1>", "utf-8");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(content, "utf-8");
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
