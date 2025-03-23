use wasm_bindgen::prelude::*;
use md5::{Md5, Digest};
use hex;
use js_sys;
// 导入 js_sys 来获取时间戳
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = Date)]
    fn now() -> f64;
}
// 导出获取时间戳的函数
#[wasm_bindgen]
pub fn get_timestamp() -> String {
    let timestamp = now();
    let date = js_sys::Date::new(&JsValue::from_f64(timestamp));
    format!("{:04}-{:02}-{:02} {:02}:{:02}:{:02}",
        date.get_full_year(),
        date.get_month() + 1,  // JavaScript 月份从 0 开始
        date.get_date(),
        date.get_hours(),
        date.get_minutes(),
        date.get_seconds()
    )
}
// 导出给 JavaScript 使用的函数
#[wasm_bindgen]
pub fn verify_login(username: &str, password: &str) -> bool {
    // 这里是一个简单的示例，实际应用中应该使用更安全的验证方式
    let hashed_password = hash_password(password);
    // 这里使用 MD5 加密后的密码进行比较
    // 注意：这个哈希值对应的是 "password123" 的 MD5
    if username == "admin" && hashed_password == "482c811da5d5b4bc6d497ffa98491e38" {
        true
    } else {
        false
    }
}
// 导出一个用于 MD5 加密密码的函数
#[wasm_bindgen]
pub fn hash_password(password: &str) -> String {
    // 创建一个 MD5 hasher 实例
    let mut hasher = Md5::new();
    // 更新 hasher 的输入数据
    hasher.update(password.as_bytes());
    // 计算哈希值并转换为十六进制字符串
    let result = hasher.finalize();
    hex::encode(result)
}
