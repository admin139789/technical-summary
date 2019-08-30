# WebSocket

##### 1.   ws/wss 区别

###### https://blog.csdn.net/garrettzxd/article/details/81674251  （http协议下使用ws，在https协议下使用wss）

let protocol = location.protocol === 'https' ? 'wss://localhost:8888' : 'ws://localhost:8889';
new WebSocket(protocol);

去判断是否使用ws 或者 wss   

##### 2.socket和websocket的区别

软件通信有七层结构，下三层结构偏向与数据通信，上三层更偏向于数据处理，中间的传输层则是连接上三层与下三层之间的桥梁，每一层都做不同的工作，上层协议依赖与下层协议。基于这个通信结构的概念。

Socket 其实并不是一个协议，是应用层与 TCP/IP 协议族通信的中间软件抽象层，它是一组接口。当两台主机通信时，让 Socket 去组织数据，以符合指定的协议。TCP 连接则更依靠于底层的 IP 协议，IP 协议的连接则依赖于链路层等更低层次。

WebSocket 则是一个典型的应用层协议。

总的来说：Socket 是传输控制层协议，WebSocket 是应用层协议。

##### 3.websocket并不是所有浏览器都支持

```
//  判断是否支持websocket
WebSocketTest();
function WebSocketTest(){
    if("WebSocket" in window){
    console.log('这个浏览器支持websocket');
    }
}
```

##### 4.open，message，close方法

```
<script type="text/javascript">
    function WebSocketTest()
    {
        if ("WebSocket" in window)
        {
        alert("您的浏览器支持 WebSocket!");

        // 打开一个 web socket
        var ws = new WebSocket("ws://localhost:9998/echo");

        ws.onopen = function()
        {
        // Web Socket 已连接上，使用 send() 方法发送数据（前提是）
        ws.send("发送数据");
        alert("数据发送中...");
        };

        ws.onmessage = function (evt) 
        { 
        var received_msg = evt.data;
        alert("数据已接收...");
        };

        ws.onclose = function()
        { 
        // 关闭 websocket
        alert("连接已关闭..."); 
        };
        }

        else
        {
        // 浏览器不支持 WebSocket
        alert("您的浏览器不支持 WebSocket!");
        }
    }
</script>
```

```
export var websock = {};
var msgQueue = [];
let wsuri

export function initWebSocket() { //初始化weosocket
    //访问地址
    let hostname = window.location.hostname
    let urlrequest = localStorage.getItem('requesturl')
    //请求websocket地址
    let wsaddr = localStorage.getItem('wsaddr')
    let wsHost = localStorage.getItem('wsHost')
    if(hostname.indexOf('localhost')!=-1||hostname.indexOf('192')!=-1){
        wsuri='ws://'+wsaddr;
    }else if(!hostname) {//app
        wsuri='ws://'+wsaddr;
    }
    else{
        wsuri = "ws://"+wsaddr;
    }
    websock = new WebSocket(wsuri);
};
function setWsUrl(hostname){
}
export function websocketsend(agentData) { //数据发送
    msgQueue.unshift(agentData);

    // WebSocket处于OPEN的状态时,将消息队列中的消息逐个取出来发送
    if (websock.readyState === 1) {
        for (var i = 0; i < msgQueue.length; i++) {
            var msg = msgQueue.pop();
            var _msg = JSON.stringify(msg);
            console.log("发送的消息为：" + _msg);
            websock.send(_msg);
        }
    }
};
export default {
    websock,
    initWebSocket,
    websocketsend,
}
```

```
//方法
1.发送消息
socket.send(参数);

2.关闭socket连接
socket.close（）；
```

##### 5.重新叙述open，message，send！！！！！！！！！！！！！！（重点看）

都要去监听！！！

```
1.open+send
监听ws的开启
进行的操作是发送数据给服务端,利用send方法
```

```
2.message
获得服务端的所有数据（包括自己的，还有其他人），说白就是可以共同看到所有人利用open+send发送的数据！！！
```

```
send: 客户端->服务端
message：服务端 -> 客户端
```

