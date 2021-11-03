/**
 *
 * Segmenter
 *
 * @author Takuto Yanagida
 * @version 2021-11-02
 *
 */


const CHAR_TYPES = ['S', 'E', 'I', 'K', 'H', 'N'];
const CHAR_PATS = {
	S: /[「『（［｛〈《【〔〖〘〚＜“]/u,
	E: /[」』）］｝〉》】〕〗〙〛＞”、，。．？！を：・]/u,
	I: /[ぁ-んゝ]/u,
	K: /[ァ-ヴーｱ-ﾝﾞｰ]/u,
	H: /[一-龠々〆ヵヶ]/u,
	N: /[0-9０-９]/u
};
const PAIRS = { 'S*': 1, 'II': 1, 'KK': 1, 'HH': 1, 'HI': 1, 'NN': 1, 'OO': 1, 'ON': 1, 'NO': 1 };
const PARTICLE_A = 'でなければ|について|により|かしら|くらい|けれど|なのか|ばかり|ながら|ことよ|こそ|こと|さえ|しか|した|たり|だけ|だに|だの|つつ|ても|てよ|でも|とも|から|など|なり|ので|のに|ほど|まで|もの|やら|より|って|で|と|な|に|ね|の|も|は|ば|へ|や|わ|を|か|が|さ|し|ぞ|て'.split('|');
const PARTICLE_H = {};
for (const ja of PARTICLE_A) PARTICLE_H[ja] = true;
const PRE_KANJI = 'お|ご'.split('|');
const ADNOMINAL = 'ありとあらゆる|おもいきった|たくまざる|ああいう|ああした|あらゆる|いかなる|いかれる|いわゆる|おおきな|おかしな|そういう|ちいさな|なだたる|はずべき|ひょんな|ふとした|あんな|かかる|きたる|こんな|そんな|とんだ|どんな|むこう|あの|ある|かの|この|さる|その|どの|わが'.split('|');

function initialize(ts) {
	for (const t of ts) segmentElement(t);
}


// -------------------------------------------------------------------------


function segmentElement(elm) {
	const tn = elm.tagName;
	const fs = [];

	for (const c of Array.from(elm.childNodes)) {
		if (c.nodeType === 1) {  // ELEMENT_NODE
			segmentElement(c);
			fs.push(c.outerHTML);
		} else if (c.nodeType === 3) {  // TEXT_NODE
			fs.push(apply(c.textContent, tn));
		}
	}
	elm.innerHTML = fs.join('');
}

function apply(text, tn) {
	let parts = [];
	let tP = '';
	let word = '';
	let tWordHead = '';

	for (let i = 0, I = text.length; i < I; i += 1) {
		const c = text.substring(i, i + 1);
		const t = getCharType(c);
		if (PAIRS[tP + t] || PAIRS['*' + t] || PAIRS[tP + '*']) {
			word += c;
			if (word === c) tWordHead = t;
		} else {
			if (0 < word.length) parts.push([word, tWordHead, tP]);
			word = c;
			tWordHead = t;
		}
		tP = t;
	}
	if (0 < word.length) parts.push([word, tWordHead, tP]);

	parts = concatParticle(parts);
	parts = concatStopChar(parts);
	parts = concatMeasureWord(parts);
	parts = splitKanjiPrefix(parts, PRE_KANJI);
	parts = splitTailAdnominal(parts, ADNOMINAL);
	if (parts.length === 1 && (!tn || tn === 'SPAN')) return text;
	return wrapWithSpan(parts);
}

function concatParticle(ws) {
	const newWs = [];
	let wP = null;

	for (const w of ws) {
		if (wP && PARTICLE_H[w[0]]) {
			wP[0] += w[0];
			wP[2] = w[2];
		} else {
			newWs.push(w);
			wP = w;
		}
	}
	return newWs;
}

function concatStopChar(ws) {
	const newWs = [];
	let wP = null;

	for (const w of ws) {
		if (wP && w[1] === 'E') {
			wP[0] += w[0];
			wP[2] = w[2];
		} else {
			newWs.push(w);
			wP = w;
		}
	}
	return newWs;
}

function concatMeasureWord(ws) {
	const newWs = [];
	let wP = null;

	for (const w of ws) {
		if (wP && wP[2] === 'N') {
			wP[0] += w[0];
			wP[2] = w[2];
		} else {
			newWs.push(w);
			wP = w;
		}
	}
	return newWs;
}

function splitKanjiPrefix(ws, pres) {
	if (ws.length <= 1) return ws;

	for (let i = 1, I = ws.length; i < I; i += 1) {
		const w = ws[i], wP = ws[i - 1], swP = wP[0];
		if (w[1] !== 'H') continue;

		for (const pre of pres) {
			if (swP.endsWith(pre)) {
				const len = pre.length;
				wP[0] = swP.substr(0, swP.length - len);
				wP[2] = getCharType(wP[0][wP[0].length - 1]);
				w[0] = pre + w[0];
				w[1] = 'I';
			}
		}
	}
	return ws;
}

function splitTailAdnominal(ws, pns) {
	const newWs = [];

	for (const w of ws) {
		let split = false;
		for (const pn of pns) {
			if (w[0].endsWith(pn)) {
				w[0] = w[0].substr(0, w[0].length - pn.length);
				newWs.push(w);
				newWs.push([pn, 'I', 'I']);
				split = true;
				break;
			}
		}
		if (split) continue;
		newWs.push(w);
	}
	return newWs;
}

function wrapWithSpan(ws) {
	const reB = /^\s/;
	const reA = /\s$/;
	let ret = '';

	for (const w of ws) {
		if (w[1] !== 'O' || w[2] !== 'O') {
			const sb = reB.exec(w[0]);
			const sa = reA.exec(w[0]);
			const before = (sb !== null) ? sb[0] : '';
			const after  = (sa !== null) ? sa[0] : '';

			ret += before + '<span>' + w[0] + '</span>' + after;
		} else {
			ret += w[0];
		}
	}
	return ret;
}

function getCharType(c) {
	for (const t of CHAR_TYPES) {
		const p = CHAR_PATS[t];
		if (p.test(c)) return t;
	}
	return 'O';
}
