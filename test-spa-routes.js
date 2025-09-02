import { request } from 'http';

// 定义测试服务器URL
const BASE_URL = 'http://localhost:8080';

console.log('\n=== SPA路由功能测试 ===');
console.log(`测试服务器: ${BASE_URL}\n`);

// 函数：发送HTTP请求并显示结果摘要
function testRoute(path) {
    return new Promise((resolve) => {
        const url = `${BASE_URL}${path}`;
        console.log(`\n测试路径: ${url}`);
        
        const options = {
            method: 'GET',
            timeout: 5000,
            headers: {
                'User-Agent': 'SPA-Route-Tester'
            }
        };
        
        const req = request(url, options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                console.log(`状态码: ${res.statusCode}`);
                console.log(`内容类型: ${res.headers['content-type'] || '未知'}`);
                console.log(`内容长度: ${data.length} 字节`);
                
                // 检查是否返回了HTML内容（不区分大小写）
                if (res.headers['content-type']?.includes('text/html') && (data.toLowerCase().includes('<!doctype html>') || data.includes('<html'))) {
                    console.log('✅ 成功: 返回了有效的HTML内容');
                } else {
                    console.log('❌ 失败: 没有返回有效的HTML内容');
                }
                resolve();
            });
        });
        
        req.on('error', (e) => {
            console.log(`❌ 请求失败: ${e.message}`);
            resolve();
        });
        
        req.on('timeout', () => {
            console.log('❌ 请求超时');
            req.destroy();
            resolve();
        });
        
        req.end();
    });
}

// 运行所有测试
async function runTests() {
    // 测试1: 首页
    await testRoute('/');
    
    // 测试2: 回忆画廊页面 - 直接访问
    await testRoute('/gallery');
    
    // 测试3: 祝福页面 - 直接访问
    await testRoute('/blessing');
    
    // 测试4: 不存在的路径 - 应该回退到index.html
    await testRoute('/non-existent-path');
    
    console.log('\n=== 测试完成 ===');
    console.log('\n解释:');
    console.log('- 所有路径都应该返回状态码200和有效的HTML内容');
    console.log('- 对于不存在的物理文件路径，服务器应该回退到index.html');
    console.log('- 这确保了SPA路由在直接访问或刷新页面时能正常工作');
    console.log('\n如果所有测试都通过，但浏览器中仍有问题，请检查:');
    console.log('1. 浏览器缓存问题 (尝试清除缓存或使用无痕模式)');
    console.log('2. 生产环境的服务器配置是否正确');
    console.log('3. 查看服务器日志以获取更多详细信息');
}

// 执行测试
runTests().catch(err => {
    console.error('测试过程中发生错误:', err);
});