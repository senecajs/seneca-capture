/* Copyright © 2023 Seneca Project Contributors, MIT License. */


type ErrorOptions = {
  ignore?: string[]
}


function error(this: any, options: ErrorOptions) {
  const seneca: any = this

  let eventName = 'act-err' +
    (seneca.version.startsWith('3') ? '-4' : '')

  let errd = seneca.root.delegate({ fatal$: false })
  let errids: any = {}

  let ignored = seneca.util.Patrun()
  for (let pat of (options.ignore || [])) {
    let patobj = seneca.util.Jsonic(pat)
    ignored.add(patobj, {})
  }


  errd.on(eventName, async function(
    this: any,
    whence: string,
    msg: any,
    meta: any,
    err?: any,
    res?: any
  ) {
    try {
      msg.sys_error_code$ = err.code
      msg.sys_error_whence$ = err.whence
      if (ignored.find(msg)) {
        return
      }

      err.id = err.id || this.util.Nid()
      if (errids[err.id]) {
        return
      }
      else {
        errids[err.id] = 1
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
      })
    }
    catch (ex) {
      console.error('@seneca/error', err, ex)
    }
  })

}


// Default options.
const defaults: ErrorOptions = {
  ignore: []
}


Object.assign(error, { defaults })

export default error

if ('undefined' !== typeof module) {
  module.exports = error
}
