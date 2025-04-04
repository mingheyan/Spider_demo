import requests
headers = { 
    "Host": "127.0.0.1:5000",
    "Connection": "keep-alive",
    "Content-Length": "0",
    "Pragma": "no-cache",
    "Cache-Control": "no-cache",
    "Sec-Ch-Ua-Platform": "Windows",
    "X-Requested-With": "XMLHttpRequest",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0",
    "Accept": "*/*",
    "Sec-Ch-Ua": "Chromium;v=134, Not:A-Brand;v=24, Microsoft Edge;v=134",
    "Sec-Ch-Ua-Mobile": "?0",
    "Origin": "http://127.0.0.1:5000",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Dest": "empty",
    "Referer": "http://127.0.0.1:5000/",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6,ar;q=0.5",
    "Cookie": "csrftoken=EcEVgrFKbwgbrfcMjCAQEjPmXqPjyC5F"
}
cookies = {
    "csrftoken": "EcEVgrFKbwgbrfcMjCAQEjPmXqPjyC5F"
}
url = "http://127.0.0.1:5000/api/check"
session = requests.Session()
session.headers.clear()
session.headers.update(headers)
session.cookies.update(cookies)
response = session.post(url)
print(response.text)
print(response)