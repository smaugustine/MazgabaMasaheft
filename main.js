const { app, BrowserWindow, dialog, ipcMain } = require('electron')

const ElectronPrefs = require('electron-prefs');
const prefs = new ElectronPrefs({
  fileName: "prefs"
})

const fs = require('fs')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  if(prefs.get('masterDirectory') == undefined) win.loadFile('setup.html')
  else {
    fs.readdir(prefs.get('masterDirectory'), (err, files) => {
      win.loadFile('index.html')
      win.webContents.send('updateRepos', files)
      console.log(files)
    })
  }

  ipcMain.on('openDirectory', function () {

    dialog.showOpenDialog(win, {
      properties: ['openDirectory']
    }).then(result => {
      if(result.canceled) console.log('cancelled')
      else {
        prefs.set('masterDirectory', result.filePaths[0])

        fs.readdir(prefs.get('masterDirectory'), (err, files) => {
          win.loadFile('index.html')
          win.webContents.send('updateRepos', files)
        })
      }
    }).catch(err => {
      console.log(err)
    })

  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  app.quit()
})