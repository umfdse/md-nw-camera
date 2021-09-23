import XLSX, { utils } from 'xlsx';

const EXCEL = {
  // 导出Excel方法
  /**
     * @description                  依据数据导出表格，一般是根据查询出的数据导出表格
     * @param {Object} option        Object--配置对象
     * @param option.title      Array--表头，即表格首行展示的内容，如：['姓名','年龄','性别','地址']
     * @param option.body       Array--表格内容，二维数组，每一行的内容为一个数组，与表头对应，如:[['王小虎',28,'男','aa'],['王大虎',29,'男','aa']]
     * @param option.name       String--文件名，如:'demo'
     * @param option.suffix     String--文件后缀名，如'csv'
     * @param option.merges     Array--表格的单元格合并信息，如[
          { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } },-----表示A1和A2单元格合并
          { s: { r: 0, c: 1 }, e: { r: 0, c: 2 } },-----表示B1和C1单元格合并
          { s: { r: 0, c: 3 }, e: { r: 0, c: 4 } },-----表示D1和E1单元格合并
          { s: { r: 0, c: 5 }, e: { r: 1, c: 5 } }-----表示F1和F2单元格合并
        ]------s:start,e:end,r:row,c:cell;
     */
  exportFromArray(option) {
    const config = Object.assign({}, { name: 'demo', suffix: 'csv' }, option);
    const { title, body, name, suffix, merges } = config;
    const array = [...title, ...body];
    const workBook = utils.book_new();// 创建workBook
    const workSheet = utils.aoa_to_sheet(array);// 将数组转换成workSheet
    const fileName = name + '.' + suffix;
    workSheet['!merges'] = merges;
    utils.book_append_sheet(workBook, workSheet, name);
    XLSX.writeFile(workBook, fileName, { bookType: suffix, type: 'buffer' });
  },
  /**
     * @description                      依据网页中的表格导出文件，只导出网页中的表格数据
     * @param {Object} option            配置对象
     * @param {string} option.id         表格在dom中的id,必传
     * @param {string} option.name       String--文件名，如:'demo'
     * @param {string} option.suffix     String--文件后缀名，如'csv'
     */
  exportFromTable(option) {
    const config = Object.assign({}, { name: 'demo', suffix: 'csv', sheetName: '信息表' }, option);
    const { id, name, suffix, merges, sheetName } = config;
    const workBook = utils.book_new();
    const workSheet = utils.table_to_sheet(document.getElementById(id));
    const fileName = name + '.' + suffix;
    workSheet['!merges'] = merges;
    utils.book_append_sheet(workBook, workSheet, sheetName);
    XLSX.writeFile(workBook, fileName, { bookType: suffix, type: 'buffer' });
  },
  /**
     * @description  解析表格文件数据，返回表格中内容，目前暂不支持导入有单元格合并的表格
     * @param    {Object} file    导入的文件，二进制数据流
     * @returns  {Object} data    返回的表格数据
     * @returns  {Array}  data.title   表头
     * @returns  {Array}  data.body    表格数据
     */
  async importFromLocal(file) {
    const workBook = await this.readerWorkBookFromLocal(file);
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const content = utils.sheet_to_json(workSheet);
    const data = {};
    data.title = Object.keys(content[0]);
    data.body = content;
    return data;
  },
  /**
     * @description              本地读取文件的方法
     * @param {Object} file      文件流
     */
  readerWorkBookFromLocal(file) {
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    return new Promise(function (resolve, reject) {
      reader.onload = function (e) {
        const fileData = e.target.result;
        if (reader.readyState === 2) {
          const workBook = XLSX.read(fileData, { type: 'binary' });
          resolve(workBook);
        } else {
          reject('读取文件失败');
        }
      };
    });
  },
  openDownloadDialog(url, saveName) {
    if (typeof url == 'object' && url instanceof Blob) {
      url = URL.createObjectURL(url); // 创建blob地址
    }
    var aLink = document.createElement('a');
    aLink.href = url;
    aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，
    var event;
    if (window.MouseEvent) event = new MouseEvent('click');
    else {
      event = document.createEvent('MouseEvents');
      event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    aLink.dispatchEvent(event);
  },
  sheet2blob(sheet, sheetName) {
    sheetName = sheetName || 'sheet1';
    var workbook = {
      SheetNames: [sheetName],
      Sheets: {}
    };
    workbook.Sheets[sheetName] = sheet;
    // 生成excel的配置项
    var wopts = {
      bookType: 'xlsx', // 要生成的文件类型
      bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
      type: 'binary'
    };
    var wbout = XLSX.write(workbook, wopts);
    var blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    // 字符串转ArrayBuffer
    function s2ab(s) {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }
    return blob;
  },
  exportJson: function (json) {
    var sheet = XLSX.utils.aoa_to_sheet(json);
    sheet['!merges'] = [
      // 设置A1-C1的单元格合并
      { e: { r: 0, c: 2 }, s: { r: 0, c: 0 } }
    ];
    sheet['!cols'] = [{ wch: 10 }, { wch: 50 }];
    this.openDownloadDialog(this.sheet2blob(sheet), '模板.xlsx');
  }
};

export default EXCEL;
