from flask import Flask, request, jsonify
from flask_cors import CORS
import hashlib
import time

app = Flask(__name__)
CORS(app)
SECRET_KEY = 'your-secret-key'
def verify_sign(data):
    """验证签名"""
    timestamp = str(data.get('_timestamp', ''))
    nonce = str(data.get('_nonce', ''))
    sign = str(data.get('_sign', ''))
    if not all([timestamp, nonce, sign]):
        return False
    # 验证时间戳是否在5分钟内
    now = int(time.time() * 1000)
    if abs(now - int(timestamp)) > 300000:  # 5分钟
        return False
    # 验证签名
    expected_sign = hashlib.md5(
        f"{timestamp}{nonce}{SECRET_KEY}".encode()
    ).hexdigest()
    return sign == expected_sign
@app.route('/api/data', methods=['POST'])
def handle_data():
    data = request.get_json() 
    # 验证签名
    if not verify_sign(data):
        return jsonify({
            'code': 403,
            'message': '签名验证失败'
        }), 403
    # 处理请求
    return jsonify({
        'code': 200,
        'message': '请求成功',
        'data': {
            'received_message': data.get('message'),
            'server_time': int(time.time() * 1000)
        }
    })
if __name__ == '__main__':
    app.run(debug=True, port=5000) 