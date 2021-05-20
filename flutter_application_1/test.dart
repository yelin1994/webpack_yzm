
import 'dart:convert';
import 'dart:io';
import 'dart:math';
import 'dart:async';

import 'package:dio/dio.dart';

String name;
// class Point1 {
//   double x = 0;
//   double y = 0;
//   Point1(this.x, this.y);
//   Point1.origin(xOrigin, yOrigin)
//     : x = xOrigin,
//       y = yOrigin;
//   Point1.originX(double x) : this(x, 0.0);

//   Point1 operator +(Point1 v) => Point1(x + v.x, y + v.y);
//   static final<String, Logger> _cache
// }

main(List<String> args) async {
  // name = 'yuri';
  // var circle = new Circle(2);
  // var x = 1.2;
  // 3.1231233.toStringAsFixed(2);
  // x.abs();
 
  // assert(x > 4);
  // print('${circle.area}  ${circle.capitalize(name)} ${"100".parseInt()}');
  // print('Hello World $name , you will be yourself, and get more then ${1 + 99} billion ');

  // var p1 = Point1(2, 2);
  // var p2 = Point1.origin(3.1, 4.1);
  // // var p2 = Point.fromJson({'x': 1, 'y': 2});
  // var list1 =  <int>[1, 2, 3];
  // list1.add(4);
  // print(list1);
  // print(list1.runtimeType);
  Dio dio = Dio();
  var response = await dio.get('http://app3.qdaily.com/app3/homes/index_v2/0.json');
  print(response);
}

class Circle {
  double raidus;
  Circle(this.raidus);
  double get area => pi * raidus * raidus;
  double get circumference => pi * 2.0 * raidus;
  String  capitalize(String name) => 
    '${name[0].toUpperCase()}${name.substring(1)}';
}


class Test {
  var list = [];
  addList(item) => list.add(item);

}

var mySet = <Object>{1, '2', '323', Test()};
addMap(item) => mySet.add(item);


addTest(Test test1, Test test2) {
  var list =[...test1.list];
  Uri.encodeFull('https://example.org/api?foo=some message'); // 对除了特殊字符（例如 /， :， &， #）以外的字符进行编解码
  Uri.encodeComponent('https://example.org/api?foo=some message'); // 对 URI 中具有特殊含义的所有字符串字符
  Uri.parse('https://'); // 解析 URI
  var uri = Uri(
    scheme: 'https',
    host: 'example.org',
    path: '/foo/bar',
    fragment: 'frag');
    assert(uri.toString() == 'https://example.org/foo/bar#frag');
  return list;
}

class Line implements Comparable<Line> {
  final int length;
  const Line(this.length);
  
  int compareTo(Line other) => length - other.length;
}
compareFun() {
  var short = Line(1);
  var long = Line(100);
  assert(short.compareTo(long) < 0);
}

timeFun () {
  var now = DateTime.now(); // 返回当前时间

  var y2k = DateTime(2000);// january 1, 2000

  y2k = DateTime(2000, 1, 2); // january 2, 2000

  y2k = DateTime.utc(2000); // 1/1/2000, UTC

  // Parse an ISO 8601 date.
  y2k = DateTime.parse('2000-01-01T00:00:00Z');

  var y2001 = y2k.add(Duration(days: 366));
  assert(y2001.year == 2001);

  // Subtract 30 days.
  var december2000 = y2001.subtract(Duration(days: 30));
  assert(december2000.year == 2000);
  assert(december2000.month == 12);

  // Calculate the difference between two dates.
  // Returns a Duration object.
  var duration = y2001.difference(y2k);
  assert(duration.inDays == 366); // y2k was a leap year
}


futureFun ()  async{
  deleteLotsOf() async {

  }
  addLotsOf() async{

  }

  await Future.wait([
    deleteLotsOf(),
    addLotsOf()
  ]);
}

fileFun () {
  var searchPath = '';
  // listen  == await for 
  FileSystemEntity.isDirectory(searchPath).then((isDir) {
    if(isDir) {
      final startingDir = Directory(searchPath);
      startingDir.list().listen((event) {
        if (event is File) {
          
        }
      });
    }
  });
}


convertFun () {
  var scores = [
    {'score': 40},
    {'score': 80},
    {'score': 100, 'overtime': true, 'special_guest': null}
  ];
  var jsonText = jsonEncode(scores);
  assert(jsonText != 'sd');

  List<int> utf8Bytes = [
    0xc3, 0x8e, 0xc3, 0xb1, 0xc5, 0xa3, 0xc3, 0xa9,
    0x72, 0xc3, 0xb1, 0xc3, 0xa5, 0xc5, 0xa3, 0xc3,
    0xae, 0xc3, 0xb6, 0xc3, 0xb1, 0xc3, 0xa5, 0xc4,
    0xbc, 0xc3, 0xae, 0xc5, 0xbe, 0xc3, 0xa5, 0xc5,
    0xa3, 0xc3, 0xae, 0xe1, 0xbb, 0x9d, 0xc3, 0xb1
  ];

  var funnyWord = utf8.decode(utf8Bytes);

  assert(funnyWord == 'Îñţérñåţîöñåļîžåţîờñ');

  var stream = File('strsd').openRead();
  utf8.decoder.bind(stream).transform(LineSplitter());
}

abstract class Doer {
   doSomething(){}
}

class EffectiveDoer extends Doer {
   doSomething() {}
}

mixin Musical {
  var canPlayPiano = false;
  var canCompose = false;
  var canConduct = false;

  entertainMe() {

  }
}

class Queue {
  static var initialCapacity = 16;
}


abstract class Cache<T> {
  T getBykey(String key);
  setByKey(String key, T values);
}

Iterable<int> naturalsTo(n) sync * {
  int k = 0;
  while(k < n) yield k++;
}

Stream<int> asynchronousNaturalsTo(int n) async* {
  int k = 0;
  while(k < n) yield k++;
}
