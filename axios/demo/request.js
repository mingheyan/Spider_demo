// axios基础配置
axios.defaults.baseURL = 'http://localhost:5000';
// 生成加密参数
function generateEncryptParams() {
    const timestamp = new Date().getTime();
    const nonce = Math.random().toString(36).substr(2);
    // 使用 timestamp + nonce + 密钥 生成签名
    const sign = CryptoJS.MD5(timestamp + nonce + 'your-secret-key').toString();
    
    return {
        _timestamp: timestamp,
        _nonce: nonce,
        _sign: sign
    };
}
// 请求拦截器
axios.interceptors.request.use(
    config => {
        // 获取加密参数
        const encryptParams = generateEncryptParams();
        // 将加密参数添加到请求中
        if (config.method === 'get') {
            config.params = {
                ...config.params,
                ...encryptParams
            };
        } else if (config.method === 'post') {
            config.data = {
                ...config.data,
                ...encryptParams
            };
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
// 响应拦截器
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        console.error('请求错误:', error);
        return Promise.reject(error);
    }
);
// 发送请求的示例函数
async function sendRequest() {
    try {
        const response = await axios.post('/api/data', {
            message: 'Hello Server'
        });
        document.getElementById('result').textContent = 
            JSON.stringify(response.data, null, 2);
    } catch (error) {
        document.getElementById('result').textContent = 
            '请求失败: ' + error.message;
    }
} 