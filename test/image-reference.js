'use strict'

var test = require('tape')
var u = require('unist-builder')
var to = require('..')

test('ImageReference', function (t) {
  t.deepEqual(
    to(u('imageReference', {identifier: 'charlie', alt: 'charlie'})),
    u('text', '![charlie]'),
    'should fall back on `imageReference`s without definition'
  )

  t.deepEqual(
    to(
      u('imageReference', {
        identifier: 'foxtrot',
        referenceType: 'full',
        alt: 'golf'
      })
    ),
    u('text', '![golf][foxtrot]'),
    'should fall back on full `imageReference`s'
  )

  t.deepEqual(
    to(
      u('imageReference', {
        identifier: 'india',
        referenceType: 'collapsed',
        alt: 'india'
      })
    ),
    u('text', '![india][]'),
    'should fall back on collapsed `imageReference`s'
  )

  t.deepEqual(
    to(
      u('paragraph', [
        u('imageReference', {
          identifier: 'november',
          alt: 'oscar'
        }),
        u('definition', {
          identifier: 'november',
          url: 'https://papa.québec/romeo',
          title: 'sierra'
        })
      ])
    ),
    u('element', {tagName: 'p', properties: {}}, [
      u(
        'element',
        {
          tagName: 'img',
          properties: {
            src: 'https://papa.qu%C3%A9bec/romeo',
            alt: 'oscar',
            title: 'sierra'
          }
        },
        []
      )
    ]),
    'should transform `imageReference`s to `img`s'
  )

  t.deepEqual(
    to(
      u('paragraph', [
        u('imageReference', {identifier: 'november', alt: 'oscar'}),
        u('definition', {identifier: 'november', url: ''})
      ])
    ),
    u('element', {tagName: 'p', properties: {}}, [
      u('element', {tagName: 'img', properties: {src: '', alt: 'oscar'}}, [])
    ]),
    'should transform `imageReference`s with an empty defined url to `img`s'
  )

  t.deepEqual(
    to(
      u('imageReference', {
        identifier: 'tango',
        label: 'Tango',
        referenceType: 'full',
        alt: 'uniform'
      })
    ),
    u('text', '![uniform][Tango]'),
    'should fall back on the label on a full `imageReference` (GH-22)'
  )

  t.end()
})
