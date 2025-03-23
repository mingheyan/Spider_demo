// 声明 wasm 变量，用于存储 WebAssembly 实例
let wasm;

// 创建 TextDecoder 实例用于将 UTF-8 字节转换为字符串
// ignoreBOM: true 表示忽略字节顺序标记
// fatal: true 表示解码错误时抛出异常
const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? 
    new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : 
    { decode: () => { throw Error('TextDecoder not available') } } 
);

// 初始化检查 TextDecoder
if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

// 缓存的 Uint8Array，用于访问 WebAssembly 内存
let cachedUint8ArrayMemory0 = null;

// 获取 WebAssembly 内存的 Uint8Array 视图
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

// 从 WebAssembly 内存中读取字符串
// ptr: 内存起始位置
// len: 字符串长度
function getStringFromWasm0(ptr, len) {
    // 步骤1: 将指针转换为无符号整数，确保地址有效
    ptr = ptr >>> 0;
    
    // 步骤2: 使用 TextDecoder 解码指定内存范围的字节
    // - 获取内存视图
    // - 截取指定范围的内存片段
    // - 将字节解码为字符串
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

/**
 * 获取时间戳的导出函数
 * @returns {string} 格式化的时间戳字符串
 */
export function get_timestamp() {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.get_timestamp();
        deferred1_0 = ret[0];  // 存储返回的指针
        deferred1_1 = ret[1];  // 存储返回的长度
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        // 释放 WebAssembly 分配的内存
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

// 用于存储传递给 WebAssembly 的字符串长度
let WASM_VECTOR_LEN = 0;

// 创建 TextEncoder 实例用于将字符串转换为 UTF-8 字节
const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? 
    new TextEncoder('utf-8') : 
    { encode: () => { throw Error('TextEncoder not available') } } 
);

// 定义字符串编码函数
const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
        return cachedTextEncoder.encodeInto(arg, view);
    }
    : function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    });

// 将 JavaScript 字符串传递给 WebAssembly 内存
function passStringToWasm0(arg, malloc, realloc) {
    // 步骤1: 如果不需要重新分配内存
    if (realloc === undefined) {
        // 1.1: 将字符串编码为 UTF-8 字节
        const buf = cachedTextEncoder.encode(arg);
        // 1.2: 分配内存
        const ptr = malloc(buf.length, 1) >>> 0;
        // 1.3: 将字节写入 WASM 内存
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        // 1.4: 记录字符串长度
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    // 步骤2: 初始化变量
    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;
    const mem = getUint8ArrayMemory0();

    // 步骤3: 优化 ASCII 字符处理
    let offset = 0;
    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        // 如果遇到非 ASCII 字符则中断
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    // 步骤4: 处理非 ASCII 字符
    if (offset !== len) {
        // 4.1: 如果有部分 ASCII 字符已处理，截取剩余部分
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        // 4.2: 重新分配内存（考虑 UTF-8 编码可能需要更多空间）
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        // 4.3: 编码剩余字符
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);
        // 4.4: 调整最终大小
        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    // 步骤5: 更新字符串长度并返回指针
    WASM_VECTOR_LEN = offset;
    return ptr;
}

/**
 * 验证登录的导出函数
 * @param {string} username 用户名
 * @param {string} password 密码
 * @returns {boolean} 验证结果
 */
export function verify_login(username, password) {
    const ptr0 = passStringToWasm0(username, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.verify_login(ptr0, len0, ptr1, len1);
    return ret !== 0;
}

/**
 * 密码哈希计算的导出函数
 * @param {string} password 待哈希的密码
 * @returns {string} 哈希后的密码字符串
 */
export function hash_password(password) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ptr0 = passStringToWasm0(password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.hash_password(ptr0, len0);
        deferred2_0 = ret[0];
        deferred2_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

// 加载 WebAssembly 模块的异步函数
async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

// 获取所有导入函数的对象
function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    // 导入各种 Date 相关的函数
    imports.wbg.__wbg_getDate_ef336e14594b35ce = function(arg0) {
        const ret = arg0.getDate();
        return ret;
    };
    imports.wbg.__wbg_getFullYear_17d3c9e4db748eb7 = function(arg0) {
        const ret = arg0.getFullYear();
        return ret;
    };
    imports.wbg.__wbg_getHours_70451b8de3ce8638 = function(arg0) {
        const ret = arg0.getHours();
        return ret;
    };
    imports.wbg.__wbg_getMinutes_e793d718371e18f7 = function(arg0) {
        const ret = arg0.getMinutes();
        return ret;
    };
    imports.wbg.__wbg_getMonth_d37edcd23642c97d = function(arg0) {
        const ret = arg0.getMonth();
        return ret;
    };
    imports.wbg.__wbg_getSeconds_755197b634cca692 = function(arg0) {
        const ret = arg0.getSeconds();
        return ret;
    };
    imports.wbg.__wbg_new_31a97dac4f10fab7 = function(arg0) {
        const ret = new Date(arg0);
        return ret;
    };
    imports.wbg.__wbg_now_b9c9736d67fbc305 = function() {
        const ret = Date.now();
        return ret;
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_0;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        const ret = arg0;
        return ret;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

// 初始化 WebAssembly 内存
function __wbg_init_memory(imports, memory) {

}

// 完成 WebAssembly 初始化
function __wbg_finalize_init(instance, module) {
    // 步骤1: 保存导出的函数
    wasm = instance.exports;
    
    // 步骤2: 保存模块引用
    __wbg_init.__wbindgen_wasm_module = module;
    
    // 步骤3: 清除缓存
    cachedUint8ArrayMemory0 = null;

    // 步骤4: 调用 WASM 的启动函数
    wasm.__wbindgen_start();
    
    // 步骤5: 返回实例
    return wasm;
}

// 同步初始化 WebAssembly 模块
function initSync(module) {
    // 步骤1: 检查是否已初始化
    if (wasm !== undefined) return wasm;

    // 步骤2: 处理模块参数格式
    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)  // 解构赋值，支持新的对象参数格式
        } else {
            console.warn('使用了已废弃的参数格式')
        }
    }

    // 步骤3: 获取导入对象（包含所有需要的JS函数）
    const imports = __wbg_get_imports();

    // 步骤4: 初始化内存
    __wbg_init_memory(imports);

    // 步骤5: 确保模块是 WebAssembly.Module 实例
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    // 步骤6: 创建 WebAssembly 实例
    const instance = new WebAssembly.Instance(module, imports);

    // 步骤7: 完成初始化并返回
    return __wbg_finalize_init(instance, module);
}

// 异步初始化 WebAssembly 模块
async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('wasm_new_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

// 导出初始化函数
export { initSync };
export default __wbg_init;
