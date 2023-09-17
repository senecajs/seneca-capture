/* Copyright © 2023 Seneca Project Contributors, MIT License. */


type ErrorOptions = {
}


function error(this: any, options: ErrorOptions) {
  const seneca: any = this

  let eventName = 'act-err' +
    (seneca.version.startsWith('3') ? '-4' : '')

  seneca.on(eventName, function(
    this: any,
    whence: string,
    msg: any,
    meta: any,
    err?: any,
    res?: any
  ) {
    try {
      err.id = err.id || this.util.Nid()
      this.entity('sys/error').save$({
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
      })
    }
    catch (ex) {
      console.error('@seneca/error', err, ex)
    }
  })

}


// Default options.
const defaults: ErrorOptions = {
}


Object.assign(error, { defaults })

export default error

if ('undefined' !== typeof module) {
  module.exports = error
}
