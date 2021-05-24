import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_application_1/model/model.dart';
import 'package:flutter_application_1/widget/listImageRight.dart';

class ColumnsDetail extends StatefulWidget {
  int id;
  @override
  _ColumnsDetailState createState() => _ColumnsDetailState();
  ColumnsDetail({Key key, @required this.id}) : super(key: key);
}

class _ColumnsDetailState extends State<ColumnsDetail> {
  int id;
  int lastKey = 0;
  List<Feed> feedList = [];
  MyResponse infoResponse;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    id = widget.id;
    getInfoData();
    getData();
    _scrollController.addListener(() {
      if(_scrollController.position.pixels == _scrollController.position.maxScrollExtent) {
        getData();
      }
    });
  }

  void getInfoData() async {
    Dio dio = Dio();
    Response response = await dio.get('http://app3.qdaily.com/app3/columns/info/$id.json');
    MyResult result = MyResult.fromJson(response.data);
    setState(() {
      infoResponse = result.response;
    });
  }

  void getData() async {
    Dio dio = Dio();
    Response response = await dio.get('http://app3.qdaily.com/app3/columns/index/$id/$lastKey.json');
    MyResult result = MyResult.fromJson(response.data);
    lastKey = result.response.lastKey;
    setState(() {
      feedList.addAll(result.response.feeds);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      child: Container(
        child: ListView(
          controller: _scrollController,
          padding: EdgeInsets.all(0),
          children: [

          ],
        ),
      ),
    );
  }
}

Widget ColumnsDetailTitle(BuildContext context, 
  List<Feed> feedList,
  MyResponse infoResponse
) {
  if (feedList.length == 0 || infoResponse == null) {
    return Container();
  }
  if(infoResponse.column.showType == 1) {

  }
}

Widget ColumnsDetailTypeOne(BuildContext context, List<Feed> feedsList) {
  return ListView.separated(
    itemBuilder: (context, index) {
      return ListImageRight(context, feedsList[index]);
    }, 
    separatorBuilder: (context, id) {
      return Container(
        height: 5,
        color:  Color.fromARGB(50, 183, 187, 197),
      );
    }, 
    itemCount: feedsList.length,
    physics: NeverScrollableScrollPhysics(),
    shrinkWrap: true,
  );
}

Widget ColumnsDetailTypeTwo(BuildContext context, List<Feed> feedList) {
  return GridView.count(
    physics: NeverScrollableScrollPhysics(),
    crossAxisCount: 2,
    shrinkWrap: true,
    mainAxisSpacing: 10.0,
    crossAxisSpacing: 15.0,
    childAspectRatio: 0.612,
    padding: EdgeInsets.symmetric(horizontal:20.0),
    children: feedList.map((Feed feed){
      return ColumnsTypeTwoTile(context, feed);
    }),
  );
}

Widget ColumnsTypeTwoTile(BuildContext context, Feed feed) {
  return GestureDetector(
    onTap: () {

    },
    child:  Container(
      decoration: BoxDecoration(
        border: Border.all(width: 0.5, color: Color.fromARGB(50, 183, 187, 197)),
      ),
      width: ,
    ),
  );
}