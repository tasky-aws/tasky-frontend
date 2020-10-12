import { app, BrowserWindow, nativeTheme, nativeImage } from 'electron'
import path from 'path'

try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(require('path').join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) {
}

// /**
//  * Set `__statics` path to static files in production;
//  * The reason we are setting it here is that the path needs to be evaluated at runtime
//  */
// if (process.env.PROD) {
//   global.__statics = require('path').join(__dirname, 'statics').replace(/\\/g, '\\\\')
// }
/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = __dirname
}

let mainWindow

const iconPath = path.join(__statics, 'icons/linux-512x512.png')
function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 1200,
    useContentSize: true,
    frame: false,
    // icon: nativeImage.createFromPath(path.join(__statics, 'icons/icon.ico')),
    icon: nativeImage.createFromDataURL(iconPath),
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: true,
      nodeIntegrationInWorker: true

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    }
  })

  mainWindow.loadURL(process.env.APP_URL)

  // const image = nativeImage.createFromPath(
  //   path.join(__statics, 'icons/icon.ico')
  // )
  // app.dock.setIcon(image)
  // tray = new Tray(image)
  // const contextMenu = Menu.buildFromTemplate([
  //   {
  //     label: 'Fechar',
  //     type: 'normal'
  //   }
  // ])
  // tray.setContextMenu(contextMenu)
  // mainWindow.hide()

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
