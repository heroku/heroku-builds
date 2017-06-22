let archiver = require('archiver')
let ignore = require('ignore')
let fs = require('fs')
let os = require('os')

module.exports = {

  call: function (cwd, file) {
    return new Promise(function (resolve, reject) {
      let archive = archiver('tar', { gzip: true })

      let ig = ignore()
      if (fs.existsSync('.gitignore')) {
        ig = ig.add(fs.readFileSync('.gitignore').toString())
      }
      let filter = ig.createFilter()

      archive.on('finish', function (err) {
        if (err) { reject(err) }
        resolve()
      })

      let output = fs.createWriteStream(file)
      archive.pipe(output)
      var data = {}
      if (os.platform() === 'win32' || os.platform() === 'windows') {
        data.mode = 0o0755
      }

      archive.bulk([
        { expand: true,
          cwd: cwd,
          src: ['**'],
          dest: false,
          filter: filter,
          data: data,
          dot: true
        }
      ]).finalize()
    })
  }
}
