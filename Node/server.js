import http from "http";
import fs from "fs";

const server = http.createServer((req, res) => {
    
  const data = fs.readFileSync("./index.html", "utf-8");
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(data);
  res.end();
});

server.listen(8000, () => {
  console.log("Server running at http://localhost:8000/");
});
