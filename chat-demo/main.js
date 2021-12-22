console.inspectEnable = true;
const WebApp = require('webapp');
const app = WebApp.createApp();
app.use(WebApp.static('./public'));
const SyncTable = require('synctable');
const WebSyncTable = require('websynctable');

const chatTable = new SyncTable('chat');
const imServer = new WebSyncTable(app, chatTable, {
	filter: (client, set, key, value) => {
		// 客户端设置或者获取key时候，进行检查（允许返回true，否则返回false）
		console.log('filter: ', client, set, key, value)
		return true;
	},
	onclient: (e, client) => {
		// if (e === 'connect') {
		// 	console.info(`imServer: client ${client.id} connect!`)
		// } else {
		// 	console.log(`imServer: client ${client.id} disconnect`)
		// }
		// 当前连接上的客户端数
		chatTable.set('count', imServer.clients())
	}
});

imServer.on('clear', (arg, client, reply) => {
	/* 触发客户端的clear事件 */
	chatTable.clear();
	/* 触发客户端的message事件 */
	imServer.reverse('my_notify', { foo: 'bar' });
	/* 回调 */
	reply({res: true, message: 'success'})
})

/* Start App */
app.start();

/* Event loop */
require('iosched').forever();
