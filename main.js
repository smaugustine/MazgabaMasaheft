const { app, BrowserWindow, dialog, ipcMain } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('index.html')

  ipcMain.on('openDirectory', function () {

    dialog.showOpenDialog(win, {
      properties: ['openDirectory']
    }).then(result => {
      console.log(result.canceled)
      console.log(result.filePaths)
    }).catch(err => {
      console.log(err)
    })

  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  app.quit()
})