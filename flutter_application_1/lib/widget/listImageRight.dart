
import 'package:flutter/material.dart';
import 'package:flutter_application_1/model/model.dart';
import 'package:flutter_application_1/widget/BaseModuleWidget.dart';

Widget ListImageRight(BuildContext context, Feed feed) {
    return Row(
      children: [
        Container(
          width: 200,
          height: 120,
          margin: EdgeInsets.all(0),
          child: Column(
            children: [
              Container(
                child: TitleLabel(context, feed.post.title),
                height: 90,
                padding: EdgeInsets.all(10),
                alignment: Alignment.topLeft,
              ),
              Expanded(
                child: Container(
                  padding: EdgeInsets.fromLTRB(10, 0, 10, 5),
                  alignment: Alignment.bottomLeft,
                  child: ListBottomWidget(context, feed.post),
                ),
              ),
            ],
          ),
        ),
        Expanded(
          child: Container(
            margin: EdgeInsets.only(left: 0),
            height: 120,
            child: Image.network(feed.image, fit: BoxFit.fitHeight)
          ),
        ),
      ],
    );
}