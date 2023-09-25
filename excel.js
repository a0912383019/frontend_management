const fs = require('fs');
const path = require('path');

let excel = [];

// 递归列出指定文件夹及其子文件夹中的所有文件
function listFilesRecursively(folderPath) {
    const files = fs.readdirSync(folderPath);
    files.forEach(file => {
        const filePath = path.join(folderPath, file);
        const fileStat = fs.statSync(filePath);

        if (fileStat.isDirectory()) {
            // 如果是子文件夹，递归调用该函数
            listFilesRecursively(filePath);
        } else {
            // 如果是文件，打印文件路径
            console.log(filePath);
            excel.push([filePath]); // 将文件路径包装在数组中
        }
    });
}

// 指定要列出文件的根文件夹路径
const rootFolder = './src/views/';

// 调用递归函数开始列出文件
listFilesRecursively(rootFolder);

if (excel.length > 0) {
    // 将文件路径保存到 CSV 文件
    const csvContent = excel.map(e => e.join(",")).join("\n");
    fs.writeFileSync('my_data.csv', csvContent);

    console.log('CSV 文件已生成：my_data.csv');
} else {
    console.log('没有文件需要生成 CSV。');
}





