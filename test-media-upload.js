import { submitBlessingWithMedia, getBlessingsWithMedia } from './src/utils/db-utils.js';
import fs from 'fs';

// 模拟浏览器的FileReader功能
function convertToDataURL(buffer, mimeType) {
  const base64 = buffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
}

// 测试媒体上传功能
async function testMediaUpload() {
  try {
    console.log('开始测试媒体上传功能...');
    
    // 创建一个小的测试图片文件（Base64编码的1x1像素图片）
    const smallImageData = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
    const imageDataUrl = convertToDataURL(smallImageData, 'image/png');
    
    console.log('图片数据URL创建成功，长度:', imageDataUrl.length);
    
    // 创建一个小的测试音频数据（模拟的简短音频）
    console.log('创建测试音频数据...');
    // 创建一个简单的1秒静音WAV文件
    const generateSilentWav = () => {
      const sampleRate = 44100;
      const channels = 1;
      const bytesPerSample = 2;
      const duration = 1; // 1秒
      const numSamples = sampleRate * channels * duration;
      
      const buffer = Buffer.alloc(44 + numSamples * bytesPerSample); // WAV头 + 数据
      
      // WAV文件头
      buffer.write('RIFF', 0);
      buffer.writeUInt32LE(buffer.length - 8, 4);
      buffer.write('WAVE', 8);
      buffer.write('fmt ', 12);
      buffer.writeUInt32LE(16, 16);
      buffer.writeUInt16LE(1, 20); // PCM
      buffer.writeUInt16LE(channels, 22);
      buffer.writeUInt32LE(sampleRate, 24);
      buffer.writeUInt32LE(sampleRate * channels * bytesPerSample, 28);
      buffer.writeUInt16LE(channels * bytesPerSample, 32);
      buffer.writeUInt16LE(bytesPerSample * 8, 34); // 16位
      buffer.write('data', 36);
      buffer.writeUInt32LE(numSamples * bytesPerSample, 40);
      
      // 填充静音数据（全0）
      for (let i = 0; i < numSamples; i++) {
        buffer.writeInt16LE(0, 44 + i * 2);
      }
      
      return buffer;
    };
    
    const silentWavData = generateSilentWav();
    const audioDataUrl = convertToDataURL(silentWavData, 'audio/wav');
    
    // 提交带媒体的祝福
    console.log('提交带媒体的祝福...');
    const blessingId = await submitBlessingWithMedia(
      '媒体测试用户',
      '这是一条带图片和音频的测试祝福',
      imageDataUrl,
      audioDataUrl
    );
    
    console.log('带媒体的祝福提交成功！生成的ID:', blessingId);
    
    // 验证是否能正确获取带媒体的祝福
    console.log('获取最新的祝福以验证媒体...');
    const allBlessings = await getBlessingsWithMedia();
    const latestBlessing = allBlessings.find(b => b.id === blessingId) || allBlessings[0];
    
    console.log('祝福数据验证结果:');
    console.log('- 包含照片URL:', latestBlessing.photo_url && latestBlessing.photo_url.startsWith('data:image/'));
    console.log('- 包含音频URL:', latestBlessing.audio_url && latestBlessing.audio_url.startsWith('data:audio/'));
    
    console.log('媒体上传测试完成！用户现在应该能够正常上传和查看媒体内容了。');
  } catch (error) {
    console.error('测试媒体上传失败:', error);
    console.log('错误详情:', error.message);
    console.log('错误堆栈:', error.stack);
  }
}

testMediaUpload();