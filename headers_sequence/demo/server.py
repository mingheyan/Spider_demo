from flask import Flask, request, jsonify, render_template
import os

# 获取当前文件所在目录的绝对路径
current_dir = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__, 
    template_folder=os.path.join(current_dir, 'templates')  # 指定模板目录
)

@app.route('/')
def index():
    return render_template('headers反爬.html')

@app.route('/api/check', methods=['POST'])
def check_headers():
    # 打印所有请求头，方便调试
    print("\n收到的请求头：")
    for header in request.headers:
        print(f"{header[0]}: {header[1]}")

    # 检查关键请求头的顺序
    headers_list = [header[0].lower() for header in request.headers]
    
    # 定义必须存在的请求头及其正确顺序
    required_headers_order = [
        'host',
        'connection',
        'pragma',
        'cache-control',
        'sec-ch-ua-platform',
        'user-agent',
        'accept',
        'sec-ch-ua',
        'sec-ch-ua-mobile',
        'sec-fetch-site',
        'sec-fetch-mode',
        'sec-fetch-dest',
        'referer',
        'accept-encoding',
        'accept-language'
    ]
    
    # 检查必需的请求头是否都存在
    for header in required_headers_order:
        if header not in headers_list:
            return jsonify({
                'code': 403,
                'message': '检测到爬虫请求',
                'data': None
            })
    
    # 检查请求头顺序
    last_index = -1
    for header in required_headers_order:
        current_index = headers_list.index(header)
        if current_index < last_index:
            return jsonify({
                'code': 403,
                'message': '检测到爬虫请求',
                'data': None
            })
        last_index = current_index
    
    return jsonify({
        'code': 200,
        'message': '请求成功',
        'data': {'secret': '这是机密数据'}
    })

def main():
    try:
        app.run(debug=True, host='127.0.0.1', port=5000)
    except Exception as e:
        print(f"启动服务器时发生错误: {e}")

if __name__ == '__main__':
    main() 