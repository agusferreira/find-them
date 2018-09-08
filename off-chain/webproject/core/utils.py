import threading


def run_async(function, *args):
    t = threading.Thread(target=function, args=args, kwargs={})
    t.setDaemon(True)
    t.start()
