/* Copyright © 2023 Seneca Project Contributors, MIT License. */

import Seneca from 'seneca'

import ErrorDoc from '../src/error-doc'
import Error from '../src/error'



describe('error', () => {
  test('happy', async () => {
    expect(ErrorDoc).toBeDefined()
    const seneca = Seneca({ legacy: false })
      .test()
      .use('promisify')
      .use('entity')
      .use(Error)
    await seneca.ready()
  })


  test('error-entity', async () => {
    const seneca = Seneca({ legacy: false })
      .test()
      .quiet()
      .use('promisify')
      .use('entity')
      .use(Error)
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


    let errs = await seneca.entity('sys/error').list$()
    expect(errs.length).toEqual(1)
  })


  test('ignore', async () => {
    const seneca = Seneca({ legacy: false })
      .test()
      .quiet()
      .use('promisify')
      .use('entity')
      .use(Error, {
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
    let errs = await seneca.entity('sys/error').list$()
    expect(errs.length).toEqual(0)


    expect(await seneca.post('bar:2')).toEqual({ bar: 2, x: 2 })
    errs = await seneca.entity('sys/error').list$()
    expect(errs.length).toEqual(0)


    let foo0 = await seneca.entity('foo').save$({ id$: 'a', f: 0 })
    expect(foo0).toMatchObject({ id: 'a', f: 0 })
    errs = await seneca.entity('sys/error').list$()
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
    errs = await seneca.entity('sys/error').list$()
    expect(errs.length).toEqual(0)

  })

})
