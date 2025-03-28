import { createClient } from 'redis';

async function setData(data: string[]) {
  const client = await createClient()
    .on('error', (err) => console.log('Redis Client Error', err))
    .connect();

  if (client.isReady) {
    await client.set(data[0], data[1]);
  } else {
    console.log('Redis client is not ready');
  }
  await client.disconnect();
}

async function getData(key: string): Promise<[boolean, string]> {
  const client = await createClient()
    .on('error', (err) => console.log('Redis Client Error', err))
    .connect();

  if (client.isReady) {
    const retrievedvalue = await client.get(key);
    await client.disconnect();
    if (retrievedvalue !== null) {
      return [true, retrievedvalue];
    } else {
      return [false, 'Not found.'];
    }
  } else {
    return [false, 'Redis client is not ready.'];
  }
}

export { setData, getData };
