import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_application_1/model/model.dart';
import 'package:flutter_application_1/widget/activityWidget.dart';

class ColumnsListWidget extends StatefulWidget {
  int id;
  int showType;
  ColumnsListWidget({Key key, @required this.id, this.showType}) : super(key: key);
  @override
  _ColumnsListWidgetState createState() => _ColumnsListWidgetState();
}

class _ColumnsListWidgetState extends State<ColumnsListWidget> with AutomaticKeepAliveClientMixin {
  List<Feed> feedList = [];
  int lastKey = 0;
  int id;
  int showType;

  ScrollController _scrollController = ScrollController();
  @override
  void initState() {
    super.initState();
    this.id = widget.id;
    this.showType = widget.showType;
    getColumnData();
    _scrollController.addListener(() {
      if (_scrollController.position.pixels == _scrollController.position.maxScrollExtent) {
        getColumnData();
      }
    });
  }

  void getColumnData() async {
    Dio dio = Dio();
    Response response = await dio.get('http://app3.qdaily.com/app3/columns/index/$id/$lastKey.json');
    MyResult result = MyResult.fromJson(response.data);
    if (!result.response.hasMore) {
      return;
    }
    setState(() {
      lastKey = result.response.lastKey;
      feedList.addAll(result.response.feeds);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      
    );
  }

  @override
  bool get wantKeepAlive => true;
}

Widget ColumnsContainerWidget(
  BuildContext context, 
  List<Feed> feedList, 
  ScrollController scrollController,
  int showType,
  int id
) {
  if (feedList.length == 0) {
    return Container();
  }
  return Container(
    width: MediaQuery.of(context).size.width,
    height: 320,
    padding: EdgeInsets.only(bottom: 20),
    child: Column(
      children: [
        GestureDetector(
          child: Container(
            child: ActivityTitleWidget(context, 
              feedList[0].post.column.icon, 
              feedList[0].post.column.name
            ),
          ),
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: () => 
              )
            );
          },
        )
      ],
    ),
  );
}