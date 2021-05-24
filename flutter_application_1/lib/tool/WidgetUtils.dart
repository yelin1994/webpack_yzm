import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:flutter_application_1/model/model.dart';
import 'package:flutter_application_1/widget/activityWidget.dart';
import 'package:flutter_application_1/widget/curiosityWebView.dart';
import 'package:flutter_application_1/widget/listImageRight.dart';
import 'package:flutter_application_1/widget/listImageTop.dart';
import 'package:flutter_application_1/widget/newsListWidget.dart';

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
      if(data.indexType != null) {
        widget = NewsListWidget(context, data);
      } else if(data.type == 2) {
        widget = ListImageTop(context, data);
      } else if (data.type == 0) {
        widget = ActivityWidget(context, data);
      } else if (data.type == 1) {
        widget = ListImageRight(context, data);
      }
    } else {

    }

    return GestureDetector(
      child: widget,
      onTap: () {

      },
    );
  }
}