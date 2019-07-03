# WebSocket

##### 1.   ws/wss 区别

###### https://blog.csdn.net/garrettzxd/article/details/81674251  （http协议下使用ws，在https协议下使用wss）

let protocol = location.protocol === 'https' ? 'wss://localhost:8888' : 'ws://localhost:8889';
new WebSocket(protocol);

去判断是否使用ws 或者 wss   