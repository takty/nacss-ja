/**
 *
 * Utilities
 *
 * @author Takuto Yanagida
 * @version 2021-11-03
 *
 */


function hasClass(tar, cls) {
	const key = cls.substr(1);
	if (cls.startsWith(':')) {
		return tar.dataset[key] !== undefined;
	} else {
		return tar.classList.contains(key);
	}
}

function setClass(tar, cls, enabled = true, val = '') {
	const key = cls.substr(1);
	if (cls.startsWith(':')) {
		if (enabled) {
			tar.dataset[key] = val;
		} else {
			delete tar.dataset[key];
		}
	} else {
		if (enabled) {
			tar.classList.add([key, val].join('-'));
		} else {
			tar.classList.remove([key, val].join('-'));
		}
	}
}
