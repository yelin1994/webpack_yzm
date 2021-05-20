import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:flutter_application_1/model/model.dart';
import 'package:flutter_application_1/widget/curiosityWebView.dart';
import 'package:flutter_application_1/model/model.dart';

class WidgetUtils {
  static pushToCuriosityWebView(BuildContext context, int id) async {
    Dio dio = Dio();
    Response response = await dio.get(
       "http://app3.qdaily.com/app3/articles/detail/${id}.json"
    );
    String htmlBody = MyResult.fromJson(response.data).response.article.body;
    print('hello, $id');
    Navigator.push(context, MaterialPageRoute(
      builder: (context) => CuriosityWebView(htmlBody: htmlBody)
    ));
  }

  static Widget getListItemWidget(BuildContext context, dynamic data) {
    Widget widget;
    if (data.runtimeType == Feed) {

    } else {

    }

    return GestureDetector(
      child: widget,
    );
  }
}