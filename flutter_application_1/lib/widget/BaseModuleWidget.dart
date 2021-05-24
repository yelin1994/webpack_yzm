import 'package:flutter/material.dart';
import 'package:flutter_application_1/model/model.dart';
import 'package:flutter_application_1/tool/commonUtils.dart';

Widget TitleLabel(BuildContext context, String text, {
  double fontSize = 15.0,
  int maxLines = 3
}) {
  return Text(
    text,
    style: TextStyle(
      fontSize: fontSize,
      color: Colors.black,
      fontWeight: FontWeight.w500
    ),
    overflow: TextOverflow.ellipsis,
    maxLines: maxLines,
  );
}

Widget DescriptionLabel(BuildContext context, String text, {
  double fontSize = 12,
  int maxLines = 1
}) {
  return Text(text, 
    style: TextStyle(
      fontSize: fontSize,
      color: Color.fromARGB(200, 100, 100, 100)// a 是透明度 0 是透明 255 是不透明
    ),
    maxLines: maxLines,
    textAlign: TextAlign.left,
  );
}

Widget ListBottomWidget(BuildContext context, Post post) {
  return Row(
    children: [
      DescriptionLabel(context, post.category.title),
      IconText(context, post.commentCount, 'static/feedComment.png'),
      IconText(context, post.praiseCount, 'static/feedPraise.png'),
      Padding(padding: EdgeInsets.all(5)),
      DescriptionLabel(context, CommonUtils.getNewsTimeStr(post.publishTime * 1000))
    ],
  );
}

Widget IconText(BuildContext context, int text, String imageStr) {
  return Row(
    children: [
      Padding(padding: EdgeInsets.all(2),),
      Image.asset(imageStr, fit: BoxFit.fitWidth, width: 12,height: 12,),
      Padding(padding: EdgeInsets.all(1)),
      DescriptionLabel(context, '$text')
    ],
  );
}