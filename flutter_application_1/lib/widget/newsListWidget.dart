import 'package:flutter/material.dart';
import 'package:flutter_application_1/model/model.dart';
import 'package:flutter_application_1/widget/BaseModuleWidget.dart';

Widget NewsListWidget(BuildContext context, Feed feed) {
  return Column(
    children: [
      TitleWidget(context, feed),
      NewsFirstLineWidget(context, feed.newsList[0].description, feed.image),
      Container(height:10),
      NewsLineWidget(context, feed.newsList[1].description),
      Container(
        height: 0.8,
        margin: EdgeInsets.fromLTRB(20, 0, 20, 10),
        color: Color.fromARGB(50, 183, 187, 197),
      ),
      NewsLineWidget(context, feed.newsList[2].description),
      NewsListBottomWidget(context, feed.post),
    ],
  );
}

Widget TitleWidget(BuildContext context, Feed feed) {
  return Row(
    children: [
      Container(
        width: 30,
        height: 30,
        child: CircleAvatar(backgroundImage: NetworkImage(feed.post.column.icon),),
      ),
      Padding(
        padding: EdgeInsets.fromLTRB(10, 10, 0, 0),
        child: TitleLabel(context, feed.post.column.name),
      )
    ],
  );
}

Widget NewsFirstLineWidget(BuildContext context, String title, String imageStr) {
  return Row(
    children: [
      Container(
        width: 40,
        height: 40,
        child: Image.asset('static/yellowDot.png', 
          fit: BoxFit.fitWidth, width:30, height:30),
        padding: EdgeInsets.fromLTRB(0,0, 0, 20),
      ),
      Container(
        width: 200,
        height: 40,
        child: DescriptionLabel(context, title, fontSize: 13),
      ),
      Expanded(
        child: Container(
          height: 60,
          child: Image.network(imageStr, fit: BoxFit.fitHeight)
        )
      )
    ],
  );
}

Widget NewsLineWidget(BuildContext context, String title) {
  return Row (
    children: [
      Container(
        width: 40,
        height: 30,
        child: Image.asset('static/yellowDot.png', fit: BoxFit.fitWidth),
        padding: EdgeInsets.only(bottom: 12),
      ),
      Expanded(
        child: Container(
          padding: EdgeInsets.only(right: 20),
          height: 30,
          child: DescriptionLabel(context, title, fontSize: 13),
          margin: EdgeInsets.only(right: 10),
        ),
      )
    ]
  );
}

Widget NewsListBottomWidget(BuildContext context, Post post) {
    return Row(
      children: [
        Container(
          child: ListBottomWidget(context, post),
          padding: EdgeInsets.fromLTRB(15, 0, 0, 5),
          alignment: Alignment.centerRight,
        )
      ],
    );
  }