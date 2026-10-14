#!/usr/bin/env python3
"""
Minimal auth-only server: issues JWT tokens for admin login.
All data operations go through the Express data server on port 3003.

Endpoints:
  POST /api/auth/login    - authenticate admin, return JWT
  POST /api/auth/reset    - reset password (dev only)
  GET  /health            - health check
"""
import os, sys, json, time, hmac, hashlib, base64
from pathlib import Path
from http.server import HTTPServer, BaseHTTPRequestHandler
import bcrypt as bc
import psycopg2

for _env_file in [Path(__file__).with_name('.env'), Path('.env')]:
    if _env_file.is_file():
        for _line in _env_file.read_text().splitlines():
            _line = _line.strip()
            if _line and not _line.startswith('#') and '=' in _line:
                _k, _v = _line.split('=', 1)
                os.environ.setdefault(_k.strip(), _v.strip())

PORT    = int(os.environ.get('PORT', 3001))
DB_URL  = os.environ.get('DATABASE_URL', '')
JWT_SEC = os.environ.get('JWT_SECRET', '')
CORS_ORIGIN = [s.strip() for s in os.environ.get('CORS_ORIGIN', 'https://venkatsai.roiclients.co.in').split(',')]

def _b64(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode()

def make_jwt(payload: dict) -> str:
    h = _b64(json.dumps({'alg': 'HS256', 'typ': 'JWT'}).encode())
    ts = int(time.time())
    b = _b64(json.dumps({**payload, 'iat': ts, 'exp': ts + 86400}).encode())
    return f'{h}.{b}.{_b64(hmac.new(JWT_SEC.encode(), f"{h}.{b}".encode(), hashlib.sha256).digest())}'

def get_db():
    return psycopg2.connect(DB_URL)

class Handler(BaseHTTPRequestHandler):

    def _reply(self, status: int, data: dict):
        body = json.dumps(data, default=str).encode()
        self.send_response(status)
        origin = self.headers.get('Origin', '')
        allowed = '*' if '*' in CORS_ORIGIN else (origin if origin in CORS_ORIGIN else CORS_ORIGIN[0] if CORS_ORIGIN else '*')
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', allowed)
        self.send_header('Vary', 'Origin')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_GET(self):
        path = self.path.split('?')[0]
        if path in ('/health', '/api/health', '/auth/health'):
            return self._reply(200, {'status': 'ok'})
        return self._reply(404, {'error': 'Not found'})

    def do_POST(self):
        path = self.path.split('?')[0]

        if path in ('/api/auth/reset', '/auth/reset'):
            n = int(self.headers.get('Content-Length', 0))
            try:
                body = json.loads(self.rfile.read(n) or '{}')
            except Exception:
                return self._reply(400, {'error': 'Invalid JSON'})

            username = (body.get('username') or '').strip()
            new_password = body.get('password', '')
            if not username or not new_password:
                return self._reply(400, {'error': 'username and password required'})

            try:
                conn = get_db()
                cur = conn.cursor()
                pw_hash = bc.hashpw(new_password.encode(), bc.gensalt()).decode()
                cur.execute(
                    'UPDATE admin_users SET password_hash = %s, updated_at = NOW() WHERE username = %s',
                    [pw_hash, username]
                )
                cur.execute(
                    'UPDATE admins SET password_hash = %s WHERE username = %s',
                    [pw_hash, username]
                )
                conn.commit()
                conn.close()
                self._reply(200, {'success': True, 'message': f'Password reset for {username}'})
            except Exception as e:
                self._reply(500, {'error': str(e)})
            return

        if path in ('/api/auth/login', '/auth/login'):
            n = int(self.headers.get('Content-Length', 0))
            try:
                body = json.loads(self.rfile.read(n) or '{}')
            except Exception:
                return self._reply(400, {'error': 'Invalid JSON'})

            username = (body.get('username') or '').strip()
            password = body.get('password', '')

            if not username or not password:
                return self._reply(400, {'error': 'Username and password required'})

            try:
                conn = get_db()
                cur = conn.cursor()

                cur.execute(
                    'SELECT id, username, password_hash FROM admin_users WHERE username = %s AND is_active = true',
                    [username]
                )
                row = cur.fetchone()
                table = 'admin_users'

                if not row:
                    cur.execute('SELECT id, username, password_hash FROM admins WHERE username = %s', [username])
                    row = cur.fetchone()
                    table = 'admins'

                conn.close()

                if not row:
                    return self._reply(401, {'error': 'Invalid credentials'})

                _id, uname, pw_hash = row
                if pw_hash.startswith('$2b$') or pw_hash.startswith('$2a$'):
                    if not bc.checkpw(password.encode(), pw_hash.encode()):
                        return self._reply(401, {'error': 'Invalid credentials'})
                else:
                    check = hashlib.pbkdf2_hmac('sha256', password.encode(), pw_hash.encode()[:16].encode(), 100000).hex()
                    if not hmac.compare_digest(check, pw_hash):
                        return self._reply(401, {'error': 'Invalid credentials'})

                token = make_jwt({'sub': str(_id), 'role': 'authenticator', 'username': uname})
                self._reply(200, {'token': token, 'username': uname})
            except Exception as e:
                self._reply(500, {'error': str(e)})
            return

        return self._reply(404, {'error': 'Not found'})

    def log_message(self, fmt, *args): pass

if __name__ == '__main__':
    server = HTTPServer(('0.0.0.0', PORT), Handler)
    print(f'Auth server running on port {PORT}', file=sys.stderr)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    server.server_close()
