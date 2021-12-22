import store from '@/store';
import { SyncTable } from '@edgeros/web-synctable';

const proto = location.protocol === 'http:' ? 'ws:' : 'wss:';
const server = proto + '//' + location.host;

function createSyncTable(tableName: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const syncTable: any = new SyncTable(server, tableName, {
    token: store.state.token,
    srand: store.state.srand
  });
  syncTable.addEventListener('connect', () => {
    console.log('[syncTable]connect!');
  });
  syncTable.addEventListener('disconnect', () => {
    console.log('[syncTable]disconnect!');
  });
  syncTable.addEventListener('error', (error: Error) => {
    console.error('[syncTable]error:', error);
  });
  // 服务端同名数据表调用clear方法清空数据表时触发
  syncTable.addEventListener('clear', () => {
    console.log('[syncTable]clear!');
  });
  // 监听SyncTable数据的变化
  syncTable.addEventListener('update', () => {
    console.log('[syncTable]update!');
  });
  // 类似于websocket的onmessage的实现
  // 监听服务端通过reverse触发的事件
  syncTable.onmessage = function (e: number | string, data: any) {
    console.log('[syncTable]onmessage:', e, data);
  };
  return syncTable;
}

export { createSyncTable };
