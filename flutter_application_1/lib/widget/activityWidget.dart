

import 'package:flutter/material.dart';
import 'package:flutter_application_1/model/model.dart';
import 'package:flutter_application_1/widget/BaseModuleWidget.dart';

Widget ActivityWidget(BuildContext context, Feed feed) {
  return Column(
    children: [
      Container(
        height: 50,
        child: ActivityTitleWidget(context, feed.post.column.icon, feed.post.column.name),
      ),
      Stack(
        alignment: FractionalOffset(0.07, 0.83),
        children: [
          Container(
            width: MediaQuery.of(context).size.width ,
            child: Image.network(feed.image, fit: BoxFit.cover),
          ),
          Container(
            child: Image.network(feed.post.category.imageLab, width: 30, height: 30),
          ),
        ],
      ),
      Container(
        width: MediaQuery.of(context).size.width,
        child: TitleLabel(context, feed.post.title),
        margin: EdgeInsets.fromLTRB(15, 10, 15, 8),
      ),
      Container(
        width: MediaQuery.of(context).size.width,
        child: DescriptionLabel(context, feed.post.description),
        margin: EdgeInsets.fromLTRB(15, 0, 15, 10),
      )
    ],
  );
}

Widget ActivityTitleWidget(BuildContext context, String iconString, String title) {
  return Row(
    children: [
      Container(
        margin: EdgeInsets.fromLTRB(12, 2, 10, 0),
        child: CircleAvatar(
          backgroundImage: NetworkImage(iconString),
          radius: 10,
        ),
      ),
      Container(
        margin: EdgeInsets.fromLTRB(0, 2, 10, 0),
        child: TitleLabel(context, title),
      ),
      Expanded(
        child: Container(
          padding: EdgeInsets.fromLTRB(10, 1, 10, 0),
          alignment: Alignment.centerRight,
          child: Image.asset('static/toolbarShare.png', width: 18, height: 18),
        ),
      )
    ],
  );
}