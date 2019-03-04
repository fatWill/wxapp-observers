const systemInfo = wx.getSystemInfoSync();

const compareVersion = (v1, v2) => {
	v1 = v1.split('.');
	v2 = v2.split('.');
	let len = Math.max(v1.length, v2.length);

	while (v1.length < len) {
		v1.push('0');
	}
	while (v2.length < len) {
		v2.push('0');
	}

	for (let i = 0; i < len; i++) {
		let num1 = parseInt(v1[i]);
		let num2 = parseInt(v2[i]);

		if (num1 > num2) {
			return 1;
		} else if (num1 < num2) {
			return -1;
		}
	}

	return 0;
};

export default {

	systemInfo,

	/**
	 * 基础库版本比较判断
	 *
	 * @param   {string} minVersion 最低版本
	 *
	 * @return  {number}            1为兼容版本 -1为不兼容版本 0为版本相同
	 */
	compareSdkVersion(minVersion) {
		// 获取sdk版本
		let SDKVersion = systemInfo.SDKVersion;
		return compareVersion(SDKVersion, minVersion);
	},

	/**
	 * 微信版本比较判断
	 *
	 * @param   {string} minVersion 最低版本
	 *
	 * @return  {number}            1为兼容版本 -1为不兼容版本 0为版本相同
	 */
	compareWxVersion(minVersion) {
		// 获取微信版本
		let version = systemInfo.version;
		return compareVersion(version, minVersion);
	},
};