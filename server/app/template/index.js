module.exports = {
  common: [
    {
      file: 'config.js',
      insert: null
    },
    {
      file: 'entry.vue',
      insert: function(piece) {
        return {
          name: piece.name,
          title: piece.title,
          desc: piece.desc,
          upperName: piece.name[0].toUpperCase() + piece.name.slice(1)
        }
      }
    }
  ],
  luma: [
    {
      file: 'config.js',
      insert: null
    },
    {
      file: 'main.js',
      insert: null
    },
    {
      file: 'entry.vue',
      insert: function(piece) {
        return {
          upperName: piece.name[0].toUpperCase() + piece.name.slice(1)
        }
      }
    }
  ],
  moveMountain: [
    {
      file: 'config.js',
      insert: null
    },
    {
      file: 'main.js',
      insert: null
    },
    {
      file: 'entry.vue',
      insert: function(piece) {
        return {
          upperName: piece.name[0].toUpperCase() + piece.name.slice(1)
        }
      }
    }
  ]
}
