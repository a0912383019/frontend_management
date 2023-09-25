//指令 node excel.js
const fs = require('fs');
const path = require('path');

let tests = [];
let excel = [];

//遞迴列出指定資料夾及其子資料夾中的所有文件
function listFilesRecursively1(folderPath) {
    const files = fs.readdirSync(folderPath);
    files.forEach(file => {
        const filePath = path.join(folderPath, file);
        const fileStat = fs.statSync(filePath);

        if (fileStat.isDirectory()) {
            //如果是子文件夹，遞迴調用該函数
            listFilesRecursively1(filePath);
        } else {
            tests.push(file); //儲存在數组中
        }
    });
}

const rootTestFolder = './__test__/';
listFilesRecursively1(rootTestFolder);

function listFilesRecursively2(folderPath) {
    const files = fs.readdirSync(folderPath);
    files.forEach(file => {
        const filePath = path.join(folderPath, file);
        const fileStat = fs.statSync(filePath);

        if (fileStat.isDirectory()) {
            listFilesRecursively2(filePath);
        } else {
            const fileName = path.basename(file, path.extname(file)) + '.test.js';
            if(tests.includes(fileName)) {
                excel.push([filePath, 'V']);
            } else {
                excel.push([filePath]);
            }
        }
    });
}

const rootFolder1 = './src/views/';
const rootFolder2 = './src/components/';
listFilesRecursively2(rootFolder2);
listFilesRecursively2(rootFolder1);

if (excel.length > 0) {
    const csvContent = excel.map(e => e.join(",")).join(",\n");
    fs.writeFileSync('my_data.csv', csvContent);

    console.log('CSV 文件已生成：my_data.csv');
} else {
    console.log('没有文件需要生成 CSV。');
}





