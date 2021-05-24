import 'dart:async';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_application_1/model/model.dart';
import 'package:flutter_application_1/widget/SwiperWidget.dart';
class News extends StatefulWidget {
  String url;
  News({Key key, @required this.url}):super(key: key);
  @override
  _NewsState createState() => _NewsState();
}

class _NewsState extends State<News> with AutomaticKeepAliveClientMixin{
  
  String url;
  dynamic lastKey = '0';
  List<dynamic> dataList = [];
  List<MyBanner> banners = [];
  final ScrollController _scrollController = ScrollController();
  @override
  void initState() {
    super.initState();
    _scrollController.addListener(() {
      if(_scrollController.position.pixels == _scrollController.position.maxScrollExtent) {
        getData();
      }
    });
  }
  getData() async{
    if (lastKey == '0') {
      dataList = [];
    }
    Dio dio = Dio();
    Response response = await dio.get('$url$lastKey.json');
    MyResult result = MyResult.fromJson(response.data);
    if (!result.response.hasMore) {
      return;
    }
    lastKey = result.response.lastKey;
    setState(() {
      if (result.response.banners != null) {
        banners = result.response.banners; // 给轮播图附值
      }
      List<dynamic> data = [];
      data.addAll(result.response.feeds);
      if (result.response.columns != null) {
        result.response.columns.forEach((MyColumn column) {
          data.insert(column.location, {
            'id': column.id,
            'showType': column.showType
          });
        });
      }
      dataList.addAll(data); // 给数据源附值
    });
  }

  _getListCount() {
    // 如果有数据， 最上面事轮播图 最下面事加载loading动画， 需要对列表数据 总数加 2
    return (dataList.length > 0) ? dataList.length + 2 : dataList.length + 1;
  }

  Future <void> _handleRefresh() {
    final Completer<void> completer = Completer<void>();
    Timer(Duration(seconds: 1), () {
      completer.complete();
    });
    return completer.future.then<void>((_) {
      lastKey = '0';
      getData();
    });
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      child: ListView.separated(
        itemBuilder: (context, index) {
         if (index == 0) {
           return SwiperWidget(context, banners);
         } else {
           return  Container();
         }
        }, 
        separatorBuilder: (context, idx) {
          return Container(
            height: 5,
            color: Color.fromRGBO(183, 187, 197, 0.5),
          );
        }, 
        itemCount: _getListCount(),
        controller: _scrollController,
        physics: AlwaysScrollableScrollPhysics(),
      ), 
      onRefresh: _handleRefresh,
      color: Colors.yellow, // 刷新控件的颜色
    );
  }

  @override
  bool get wantKeepAlive => true;

  @override
  void dispose() {
    super.dispose();
    _scrollController.dispose();
  }
}