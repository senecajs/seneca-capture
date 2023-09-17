"use strict";
/* Copyright © 2023 Seneca Project Contributors, MIT License. */
Object.defineProperty(exports, "__esModule", { value: true });
function error(options) {
    const seneca = this;
    let eventName = 'act-err' +
        (seneca.version.startsWith('3') ? '-4' : '');
    let errd = seneca.root.delegate({ fatal$: false });
    let errids = {};
    errd.on(eventName, async function (whence, msg, meta, err, res) {
        try {
            err.id = err.id || this.util.Nid();
            if (errids[err.id]) {
                return;
            }
            else {
                errids[err.id] = 1;
            }
            await errd.entity('sys/error').save$({
                id$: err.id,
                w: Date.now(),
                sid: this.id,
                did: this.dd,
                mid: meta.id,
                tx: meta.tx,
                ms: meta.start,
                me: meta.end,
                v: this.version,
                st: this.start_time,
                tag: this.tag,
                whence,
                code: err.code,
                text: err.message,
                msg,
                meta,
                err,
                res,
            });
        }
        catch (ex) {
            console.error('@seneca/error', err, ex);
        }
    });
}
// Default options.
const defaults = {};
Object.assign(error, { defaults });
exports.default = error;
if ('undefined' !== typeof module) {
    module.exports = error;
}
//# sourceMappingURL=error.js.map