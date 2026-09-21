# CampusConnect - Local Development Server
# Run this file with: python main.py
# It will launch a lightweight local HTTP server at http://localhost:8000

import http.server
import socketserver
import os
import webbrowser

PORT = 8000
# Go to the project root directory
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT_DIR)

Handler = http.server.SimpleHTTPRequestHandler

print(f'Starting CampusConnect local server at http://localhost:{PORT}/')
print('Press Ctrl+C to stop the server.\n')

try:
    with socketserver.TCPServer(('', PORT), Handler) as httpd:
        webbrowser.open(f'http://localhost:{PORT}/index.html')
        httpd.serve_forever()
except KeyboardInterrupt:
    print('\nServer stopped.')
