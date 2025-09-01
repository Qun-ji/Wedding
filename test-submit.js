import { submitBlessingWithMedia } from './src/utils/db-utils.js';

// 测试提交祝福功能
async function testSubmitBlessing() {
  try {
    console.log('开始测试提交祝福...');
    
    // 提交一条简单的祝福（不包含媒体）
    const blessingId = await submitBlessingWithMedia(
      '测试用户',
      '这是一条测试祝福，用于验证修复后的提交功能',
      null, // photoUrl
      null  // audioUrl
    );
    
    console.log('祝福提交成功！生成的ID:', blessingId);
    console.log('修复已生效，用户现在应该能够成功提交祝福了。');
  } catch (error) {
    console.error('测试提交祝福失败:', error);
    console.log('错误详情:', error.message);
    console.log('错误堆栈:', error.stack);
  }
}

testSubmitBlessing();