import 'dart:io';
import 'dart:convert';

fileReadFunction () async {
  var config = File('config.txt');
  var contents;
  try {
    contents = await config.readAsString();
    print('The file is ${contents.length} characters long.');

    contents = await config.readAsLines();
    print('The file is ${contents.length} lines long.');

    contents = await config.readAsBytes();
    print('The file is ${contents.length} bytes long.');
  } catch(e) {
    print(e);
  }
}

fileReadFuncStr () async {
  var config = File('config.txt');
  Stream<List<int>> inputStream = config.openRead();
  var lines = 
    utf8.decoder.bind(inputStream).transform(LineSplitter());
    // lines.listen((line) { print('Got ${line.length} characters from stream'); })
  try {
    await for(var line in lines) {
      print('Got ${line.length} characters from stream');
    }
    print('file is now closed');
  } catch (e) {
    print(e);
  }
}

fileWriteFunc() async {
  var logFile = File('log.txt');
  var sink = logFile.openWrite(); // logFile.openWrite(mode: FileMode.append) 往文件末尾
  sink.write('File Accessed');
  await sink.flush();
  await sink.close();
}


fileDirList() async {
  var dir = Directory('tmp');
  try {
    var dirList = dir.list();
    await for (FileSystemEntity f in dirList) {
      if (f is File) {

      } else if (f is Directory) {

      }
    }
  } catch (e) {

  }
}


