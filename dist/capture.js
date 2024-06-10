"use strict";
/* Copyright © 2023 Seneca Project Contributors, MIT License. */
Object.defineProperty(exports, "__esModule", { value: true });
function capture(options) {
    const seneca = this;
    let eventName = 'act-err' +
        (seneca.version.startsWith('3') ? '-4' : '');
    let errd = seneca.root.delegate({ fatal$: false });
    let errids = {};
    let ignored = seneca.util.Patrun();
    for (let pat of (options.ignore || [])) {
        let patobj = seneca.util.Jsonic(pat);
        ignored.add(patobj, {});
    }
    const errid = seneca.util.Nid({ length: 16 });
    errd.on(eventName, async function (whence, msg, meta, err, res) {
        try {
            msg.sys_capture_code$ = err.code;
            msg.sys_capture_whence$ = err.whence;
            if (false === msg.capture$ || ignored.find(msg) ||
                ('sys' === msg.base && 'capture' === msg.name)) {
                return;
            }
            let actdef = errd.find(msg);
            // console.log('AD', msg, actdef)
            err.id = err.id || errid();
            if (errids[err.id]) {
                return;
            }
            else {
                errids[err.id] = 1;
            }
            let tag = msg.capturetag$ || '';
            let capent = {
                id$: err.id,
                w: Date.now(),
                sid: this.id,
                did: this.dd,
                mid: meta.id,
                aid: actdef === null || actdef === void 0 ? void 0 : actdef.id,
                pn: actdef === null || actdef === void 0 ? void 0 : actdef.plugin_fullname,
                an: actdef === null || actdef === void 0 ? void 0 : actdef.name,
                tx: meta.tx,
                ms: meta.start,
                me: meta.end,
                v: this.version,
                st: this.start_time,
                stag: this.tag,
                pat: actdef === null || actdef === void 0 ? void 0 : actdef.pattern,
                whence,
                code: err.code,
                text: err.message,
                cp: err.callpoint,
                msg,
                meta,
                err,
                res,
                tag,
            };
            capent = options.modify.call(errd, capent, arguments, actdef);
            await errd.entity('sys/capture').save$(capent);
        }
        catch (ex) {
            console.error('@seneca/capture', err, ex);
        }
    });
}
// Default options.
const defaults = {
    ignore: [],
    modify: (capent) => capent,
};
Object.assign(capture, { defaults });
exports.default = capture;
if ('undefined' !== typeof module) {
    module.exports = capture;
}
//# sourceMappingURL=capture.js.map