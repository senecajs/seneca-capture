/* Copyright © 2023 Seneca Project Contributors, MIT License. */

import Seneca from 'seneca'

import CaptureDoc from '../src/capture-doc'
import Capture from '../src/capture'



describe('capture', () => {
  test('happy', async () => {
    expect(CaptureDoc).toBeDefined()
    const seneca = Seneca({ legacy: false })
      .test()
      .use('promisify')
      .use('entity')
      .use(Capture)
    await seneca.ready()
  })



  test('capture-entity', async () => {
    const seneca = Seneca({ legacy: false })
      .test()
      .quiet()
      .use('promisify')
      .use('entity')
      .use(Capture)
    await seneca.ready()

    let e0 = null
    try {
      await seneca.post('foo:bar')
      expect(false).toEqual(true)
    }
    catch (err) {
      e0 = err
    }

    expect(e0).toBeDefined()
    let errs = await seneca.entity('sys/capture').list$()
    expect(errs.length).toEqual(1)


    e0 = null
    try {
      await seneca.post('foo:bar', { capture$: false })
      expect(false).toEqual(true)
    }
    catch (err) {
      e0 = err
    }

    expect(e0).toBeDefined()
    errs = await seneca.entity('sys/capture').list$()
    expect(errs.length).toEqual(1)
  })


  test('ignore', async () => {
    const seneca = Seneca({ legacy: false })
      .test()
      .quiet()
      .use('promisify')
      .use('entity')
      .use(Capture, {
        ignore: ['sys:entity,name:foo', 'bar:1']
      })
      .message('bar:2', async function bar2() { return { bar: 2, x: 2 } })
    await seneca.ready()


    let e0 = null
    try {
      await seneca.post('bar:1')
      expect(false).toEqual(true)
    }
    catch (err) {
      e0 = err
    }

    expect(e0).toBeDefined()
    let errs = await seneca.entity('sys/capture').list$()
    expect(errs.length).toEqual(0)


    expect(await seneca.post('bar:2')).toEqual({ bar: 2, x: 2 })
    errs = await seneca.entity('sys/capture').list$()
    expect(errs.length).toEqual(0)


    let foo0 = await seneca.entity('foo').save$({ id$: 'a', f: 0 })
    expect(foo0).toMatchObject({ id: 'a', f: 0 })
    errs = await seneca.entity('sys/capture').list$()
    expect(errs.length).toEqual(0)

    try {
      e0 = undefined
      await seneca.entity('foo').save$({ id$: 'a', f: 1 })
      expect(false).toEqual(true)
    }
    catch (err) {
      e0 = err
    }

    expect(e0).toBeDefined()
    errs = await seneca.entity('sys/capture').list$()
    expect(errs.length).toEqual(0)

  })


  test('meta', async () => {
    const seneca = Seneca({ tag: 's0', legacy: false })
      .test()
      .quiet()
      .use('promisify')
      .use('entity')
      .use('entity-util', {
        when: {
          active: true
        }
      })
      .use(Capture, {
        modify: (capent: any) => {
          capent.foo = 99
          return capent
        }
      })
      .use(function p0() {
        this.message('a:1', async function a1(msg: any) {
          if (msg.e) {
            throw new Error(msg.e)
          }
          return { x: msg.x }
        })
      })
    await seneca.ready()

    expect(await seneca.post('a:1,x:11')).toEqual({ x: 11 })
    let errs = await seneca.entity('sys/capture').list$()
    expect(errs.length).toEqual(0)

    let e0 = null
    try {
      await seneca.post('a:1,e:e0', { capturetag$: 't0' })
      expect(false).toEqual(true)
    }
    catch (err) {
      e0 = err
    }

    expect(e0).toBeDefined()


    errs = await seneca.entity('sys/capture').list$()
    expect(errs.length).toEqual(1)
    // console.log(errs)

    expect(errs[0]).toMatchObject({
      stag: 's0',
      tag: 't0',
      pat: 'a:1',
      foo: 99,
      pn: 'p0',
      an: 'a1',
    })
  })



  test('entity-store', async () => {
    const seneca = Seneca({ legacy: false, tag: 's1' })
      .test()
      .quiet()
      .use('promisify')
      .use('entity')
      .use('entity-util', {
        when: {
          active: true,
          human: 'y',
        }
      })
      .use(Capture)
    await seneca.ready()

    expect(await seneca.entity('foo').save$({ id$: 'a', x: 1 }))
      .toMatchObject({ id: 'a', x: 1 })

    let errs = await seneca.entity('sys/capture').list$()
    expect(errs.length).toEqual(0)

    let e0 = null
    try {
      await seneca.entity('foo')
        .save$({ id$: 'a', x: 2, directive$: { capturetag$: 't0' } })
      expect(false).toEqual(true)
    }
    catch (err) {
      e0 = err
    }

    expect(e0).toBeDefined()

    errs = await seneca.entity('sys/capture').list$()
    expect(errs.length).toEqual(1)

    expect(errs[0]).toMatchObject({
      stag: 's1',
      tag: 't0',
      an: 'cmd_save_util',
      pat: 'cmd:save,sys:entity',
      pn: 'entity_util',
    })
  })


})
