"""Minimal client for the pixel-mcp server bundled with pixel-plugin.

Talks JSON-RPC over stdio, so scripts can call the same Aseprite tools
(create_canvas, draw_pixels, scale_sprite, export_sprite...) that Claude uses.
"""
import glob
import json
import os
import subprocess

CONFIG = os.path.expanduser('~/.config/pixel-mcp/config.json')


def _server_binary():
    hits = sorted(glob.glob(os.path.expanduser(
        '~/.claude/plugins/cache/pixel-plugin/pixel-plugin/*/bin/pixel-mcp')))
    if not hits:
        raise SystemExit('pixel-plugin is not installed')
    return hits[-1]


class PixelMcp:
    def __init__(self):
        env = dict(os.environ, PIXEL_MCP_CONFIG=CONFIG)
        self.proc = subprocess.Popen([_server_binary()], stdin=subprocess.PIPE,
                                     stdout=subprocess.PIPE, stderr=subprocess.DEVNULL,
                                     env=env, text=True, bufsize=1)
        self._id = 0
        self._rpc('initialize', {'protocolVersion': '2025-06-18', 'capabilities': {},
                                 'clientInfo': {'name': 'berghain2-art', 'version': '1'}})
        self._send({'jsonrpc': '2.0', 'method': 'notifications/initialized'})

    def _send(self, msg):
        self.proc.stdin.write(json.dumps(msg) + '\n')
        self.proc.stdin.flush()

    def _rpc(self, method, params):
        self._id += 1
        self._send({'jsonrpc': '2.0', 'id': self._id, 'method': method, 'params': params})
        while True:
            line = self.proc.stdout.readline()
            if not line:
                raise RuntimeError('pixel-mcp exited')
            msg = json.loads(line)
            if msg.get('id') == self._id:
                if 'error' in msg:
                    raise RuntimeError(msg['error'])
                return msg['result']

    def call(self, tool, **args):
        res = self._rpc('tools/call', {'name': tool, 'arguments': args})
        if res.get('isError'):
            raise RuntimeError(f'{tool}: {res["content"][0]["text"]}')
        return res.get('structuredContent') or json.loads(res['content'][0]['text'])

    def close(self):
        self.proc.stdin.close()
        self.proc.wait(timeout=5)
