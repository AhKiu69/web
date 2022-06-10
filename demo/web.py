import tornado.ioloop
import tornado.web
import tornado.httpserver
import tornado.options
import tornado.websocket
from setting import settings
from controller import base
from controller.base import WebRequest
import time
from tornado.escape import json_encode, json_decode
import json

#@tornado.gen.coroutine

class MainHandler(WebRequest):
    def get(self):
        self.set_header('Access-Control-Allow-Origin', '*')
        self.render("template/home.html")

class ChatHandler(WebRequest):
    def get(self):
        self.set_header('Access-Control-Allow-Origin', '*')
        print(self.current_user)
        # user_id = self.current_user['id']
        # self.user_id = user_id
        websocket_protocol = "ws" if self.request.protocol == "http" else "wss"
        aim_host = self.request.host
        self.websocket_url = "%s://%s/api/socket" % (websocket_protocol, aim_host)
        print(self.websocket_url)
        self.time_now = time.time()
        self.render('template/chat_room.html')

class AjaxTestHandler(WebRequest):
    def set_default_headers(self):
        self.set_header("access-control-allow-origin", "*")
        self.set_header("Access-Control-Allow-Headers", "x-requested-with")
        self.set_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        # HEADERS!
        self.set_header("Access-Control-Allow-Headers", "access-control-allow-origin,authorization,content-type")

    def options(self):
        # no body
        self.set_status(204)
        self.finish()

    def get(self):
        self.set_header('Access-Control-Allow-Origin', '*')
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        # name = self.get_argument('name', 'noName')
        # user_id = self.current_user['id']
        # user = nomagic._get_entity_by_id(user_id)
        # name = self.get("name","Unknown")
        msg = self.get_argument('message', 'unknown')
        icon_id = self.get_argument('icon_id','1')
        uuid = self.get_argument('uuid',None)
        msg_send_time = self.get_argument('msg_send_time',None)
        Time = int(time.time())
        # important
        msg_list=[msg,uuid,'name','user_id',icon_id,Time,msg_send_time]
        #          0    1    2     3       4      5       6
        msg_list_str = json_encode(msg_list)
        EchoWebSocket.send_to_other(self,msg_list_str)
        # ChatHistory.save(self, msg_list)
        self.finish({"info": "ok"})

clients=[]
online = 0
class EchoWebSocket(tornado.websocket.WebSocketHandler):
    @staticmethod
    def send_to_all(message):
        for c in clients:
            c.write_message(message)
    @staticmethod
    def send_to_other(self,message):
        # msg = json_decode(message)
        for c in clients:
            if self != c:
                c.write_message(message)

    def open(self):
        global online
        print("new user joined")
        online+=1
        if self not in clients:
            clients.append(self)

    def on_message(self, message):
        if message =='PING':
            EchoWebSocket.send_to_pong(self,message)
        else:
            print(message)
            EchoWebSocket.send_to_other(self,message)

    def on_close(self):
        global online
        online-=1
        print("user left")
        if self in clients:
            clients.remove(self)

    @staticmethod
    def send_to_pong(self,message):
        self.write_message('PONG')


application= tornado.web.Application([
    (r'/home',MainHandler),
    (r'/chat',ChatHandler),
    (r'/api/socket',EchoWebSocket),
    (r'/api/test',AjaxTestHandler),
],**settings)

if __name__ == "__main__":
    port = 8888
    print(f'🌀 Tornado is listening on port {port}')
    tornado.options.define("port", default=port, help="Run server on a specific port", type=int)
    tornado.options.parse_command_line()
    application_server = tornado.httpserver.HTTPServer(application, xheaders=True)
    application_server.listen(tornado.options.options.port)
    application_server.start()
    tornado.ioloop.IOLoop.instance().start()