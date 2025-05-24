// 在啟動之前，註冊 ts-node 加載器
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
register('ts-node/esm', pathToFileURL('./'));
