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


  test('entity', async () => {
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
})
