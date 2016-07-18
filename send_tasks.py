import requests, json

API = 'http://localhost:5555/api'
TASK_API = '{}/task'.format(API)

def get_async_endpoint(fnc_name):
    return '{}/async-apply/tasks.{}'.format(TASK_API, fnc_name)

def make_request(url, args=[], kws={}):
    assert isinstance(args, list), "args must be a list, not %s" % type(args)
    assert isinstance(kws, dict), "kws must be a dict, not %s" % type(kws)
    data = {"args": args, "kws": kws}
    response = requests.post(url, data=json.dumps(data))
    return response

def post_dummy_data(count = 1):
    url = get_async_endpoint("post_dummy_data")
    return make_request(url, [count])

