# PowerShell 测试脚本：验证SPA路由功能

# 定义测试服务器URL
$BASE_URL = "http://localhost:8080"

Write-Host "\n=== SPA路由功能测试 ==="
Write-Host "测试服务器: $BASE_URL\n"

# 函数：发送HTTP请求并显示结果摘要
function Test-Route($path) {
    $url = "$BASE_URL$path"
    Write-Host "\n测试路径: $url"
    
    try {
        # 发送请求并获取响应
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5
        
        # 显示状态码和内容长度
        Write-Host "状态码: $($response.StatusCode)"
        Write-Host "内容类型: $($response.Headers['Content-Type'])"
        Write-Host "内容长度: $($response.Content.Length) 字节"
        
        # 检查是否返回了HTML内容
        if ($response.Headers['Content-Type'] -like "text/html*" -and $response.Content -like "*<!DOCTYPE html>*") {
            Write-Host "✅ 成功: 返回了有效的HTML内容"
        } else {
            Write-Host "❌ 失败: 没有返回有效的HTML内容"
        }
    } catch {
        Write-Host "❌ 请求失败: $($_.Exception.Message)"
    }
}

# 测试1: 首页
Test-Route "/"

# 测试2: 回忆画廊页面 - 直接访问
Test-Route "/gallery"

# 测试3: 祝福页面 - 直接访问
Test-Route "/blessing"

# 测试4: 不存在的路径 - 应该回退到index.html
Test-Route "/non-existent-path"

Write-Host "\n=== 测试完成 ==="
Write-Host "\n解释:"
Write-Host "- 所有路径都应该返回状态码200和有效的HTML内容"
Write-Host "- 对于不存在的物理文件路径，服务器应该回退到index.html"
Write-Host "- 这确保了SPA路由在直接访问或刷新页面时能正常工作"
Write-Host "\n如果所有测试都通过，但浏览器中仍有问题，请检查:"
Write-Host "1. 浏览器缓存问题 (尝试清除缓存或使用无痕模式)"
Write-Host "2. 生产环境的服务器配置是否正确"
Write-Host "3. 查看服务器日志以获取更多详细信息"