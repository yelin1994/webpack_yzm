import 'package:flutter/material.dart';
import 'package:flutter_application_1/model/model.dart';
import 'package:flutter_swiper/flutter_swiper.dart';
import 'package:flutter_application_1/tool/WidgetUtils.dart';

Widget SwiperWidget(BuildContext context, List<MyBanner> bannerList) {
  Widget widget;
  if (bannerList.length == 0) {
    return Container();
  }
  DotSwiperPaginationBuilder builder = DotSwiperPaginationBuilder(
    color: Colors.white,
    activeColor: Colors.yellow,
    size: 7, // 未选中大小
    activeSize: 7,
    space: 5
  );
  widget = bannerList.length > 0 
    ? Swiper(
        itemCount: bannerList.length,
        loop: true,
        itemBuilder: (BuildContext context, int index) {
          return Image.network(bannerList[index].image, fit: BoxFit.cover);
        },
        pagination: SwiperPagination(
          builder: builder
        ),
        onTap: (index) {
          WidgetUtils.pushToCuriosityWebView(context, bannerList[index].post.id);
        },
      )
    : Container();

  return Container(
    height: 200,
    child: widget
  );
}