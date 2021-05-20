import 'package:dio/dio.dart';

// https://github.com/flutterchina/dio

void getHttp() async {
  try{
    var response = await Dio().get('http://www.baidu.com');
    print(response.headers);

    print(response.statusCode);
  }catch(e) {
    print(e);
  }
}

void main() {
  getHttp();
}

performGetFun() async{
  Response response;
  var dio = Dio();
  response = await dio.get('/test?id=12&name=wendu');
  print(response.data.toString());
  response = await dio.get('test', queryParameters: {'id': 12, 'name': 'wendu'});
  print(response.data.toString());

  // response = await dio.post('/test', data: {'id': 12, 'name': 'wendu'}); post 

  // response = await Future.wait([dio.post('/info'), dio.get('/token')]); 多个请求并发

  //
  response = await dio.download('http://www.baidu.com', './xx.html');


}

getDateByStream(url) async{
  Response response;
  response = await Dio().get(url, options: Options(responseType: ResponseType.stream),);
}

getDataByByte(url) async {
  Response<List<int>> rs;
  rs = await Dio().get<List<int>>(url, options: Options(responseType: ResponseType.bytes)); 
}

sendFormData(url) async {
  var formData = FormData.fromMap({
    'name': 'wendux',
    'age': 25,
  });
  var respose = await Dio().post('/info', data: formData);

  formData = FormData.fromMap({
    'file': await MultipartFile.fromFile('./text.txt', filename: 'upload.txt'),
    'files': [
      await MultipartFile.fromFile('./text1.txt', filename: 'text1.txt'),
      await MultipartFile.fromFile('./text2.txt', filename: 'text2.txt'),
    ]
  });
  respose = await Dio().post('/info', data: formData, onSendProgress: (sent, total) {

  });

  List<int> postData = <int>[];
  await Dio().post(
    url,
    data: Stream.fromIterable(postData.map((e) => [e])), //create a Stream<List<int>>
    options: Options(
      headers: {
        Headers.contentLengthHeader: postData.length, // set content-length
      },
    ),
  );
}

httpTest() async{
  var dio = Dio();

  dio.options.baseUrl = 'http://www.baidu.com';
  dio.options.connectTimeout = 5000;
  dio.options.receiveTimeout = 3000;

  var option = BaseOptions(
    baseUrl: '',
    connectTimeout: 5000,
    receiveTimeout: 3000
  );

  var response = await dio.request(
    '/test',
    data: {'id': 12, 'name': 'xx'},
    options: Options(method:"GET")
  );
}
var csrfToken;
interceptorFunc() {
  var tokenDio = Dio();
  var dio = Dio();
  dio.interceptors.add(InterceptorsWrapper(
    onRequest: (options) {
      if (csrfToken == null) {
        // dio.resolve() 直接返回结果
        // dio.reject()  直接返回错误
        // 继续进行请求返回 options
        dio.lock();
        tokenDio.get('/token').then((d) {
          options.headers['csrfToken'] = csrfToken = d.data['data']['token'];
          return options;
        }).catchError((err) {
          dio.reject(err);
        }).whenComplete(() {
          dio.unlock();
          return options;
        });
      }
      // do something before request
      return '';
    },
    onResponse: (response) {

    },
    onError:(DioError e) {
      
    }
  ));

  // dio.interceptors.add(LogInterceptor(responseBy:false)); 
}
class customerInterceptor extends Interceptor {
  @override
  Future onRequest(RequestOptions options) {
    // TODO: implement onRequest
    return super.onRequest(options);
  }
  

  @override
  Future onResponse(Response response) {
    // TODO: implement onResponse
    return super.onResponse(response);
  }

  @override
  Future onError(DioError err) {
    // TODO: implement onError
    return super.onError(err);
  }
}

/**
 * dio.lock() == dio.interceptors.requestLock.lock(); 当被上锁的时候，后续请求会处于等待队列中等待开锁
 * dio.unlock() == dio.interceptors.requestLock.unlock(); // 开锁
 * dio.clear == dio.interceptors.requestLock.clear() // 清空等待队列中的
 */

headerTest() {
  Dio().post(
    '',
    data: {},
    options: Options(contentType: Headers.formUrlEncodedContentType),
  );
}

