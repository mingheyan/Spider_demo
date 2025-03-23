from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

class WasmHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # 添加 WASM MIME 类型支持
        self.send_header("Cross-Origin-Opener-Policy", "same-origin")
        self.send_header("Cross-Origin-Embedder-Policy", "require-corp")
        SimpleHTTPRequestHandler.end_headers(self)

    def do_GET(self):
        # # 重定向根路径到前端页面
        # if self.path == '/':
        #     self.path = '/static/前端.html'
        
        # 设置 WASM 文件的 MIME 类型
        if self.path.endswith('.wasm'):
            self.send_response(200)
            self.send_header("Content-Type", "application/wasm")
            self.end_headers()
            with open('.' + self.path, 'rb') as f:
                self.wfile.write(f.read())
            return
        return SimpleHTTPRequestHandler.do_GET(self)

# 启动服务器
server = HTTPServer(('localhost', 8001), WasmHandler)
print("服务器启动在 http://localhost:8001")
server.serve_forever() 