import SimpleHTTPServer


class RequestHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    pass


RequestHandler.extensions_map[''] = 'text/html'


if __name__ == '__main__':
    SimpleHTTPServer.test(HandlerClass=RequestHandler)
