/**
 * 使用sessionStorage保存简单数据持久化到本地
 * @param {string} key 保存的数据键
 * @param {string} value 保存的数据值
 * @return {boolean} [true]
 */
function saveSessionData (key, value) {
  window.sessionStorage.setItem(key, value);
  return true;
}

/**
 * 获取保存在sessionStorage中的数据
 * @param {string} key 获取数据的键
 * @return {string} 获取数据的值
 */
function getSessionData (key) {
  return window.sessionStorage.getItem(key);
}

/**
 * 根据key删除数据
 * @param {string} key 获取数据的键
 * @return {boolean} [true]
 */
function removeSessionData (key) {
  window.sessionStorage.removeItem(key);
  return true;
}

module.exports = {
  saveSessionData,
  getSessionData,
  removeSessionData
};
