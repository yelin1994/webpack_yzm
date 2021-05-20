import 'package:flutter/material.dart';
import 'package:gsy_flutter_demo/widget/tabBar/yzm_tab_bar.dart';
import 'package:gsy_flutter_demo/widget/tabBar/tab_bar_first.dart';
import 'package:gsy_flutter_demo/widget/tabBar/tab_bar_three.dart';
import 'package:gsy_flutter_demo/widget/tabBar/tab_bar_two.dart';

class YZMAppFlutter extends StatelessWidget {
  Widget build(BuildContext context) {
    return TabBarBottomPageWidget();
  }
}


class  TabBarBottomPageWidget extends StatefulWidget {
  @override
  _TabBarBottomPageWidgetState createState() => _TabBarBottomPageWidgetState();
}

class _TabBarBottomPageWidgetState extends State<TabBarBottomPageWidget> {
  final PageController pageController = PageController();
  final List<String> tab = ['动态', '趋势', '我的'];

  _renderTab() {
    List<Widget> list = [];
    for (int i = 0; i < tab.length; i++) {
      list.add(TextButton(
        onPressed:() {
          pageController.jumpTo(
            MediaQuery.of(context).size.width * i // 获取屏幕大小
          );
        }, 
        child: Text(
          tab[i], 
          maxLines: 1,
        ),
      ));
    }
    return list;
  }

  _renderPage() {
    return [
      _tabBarPageFirst(),
      _tabBarPageTwo(),
      _tabBarPageThree()
    ];
  }

  @override
  Widget build(BuildContext context) {
    return YZMTabBar(
      type: YZMTabBar.BOTTOM_TAB, 
      tabeItems: _renderTab(), 
      tabViews: _renderPage(), 
      topPageControl: pageController, 
      backgroundColor: Colors.black45, 
      indicator: Colors.black12, 
      title: Text('YZMFlutter')
    );
  }

  Widget _tabBarPageFirst() {
    return TabBarFirst();
  }

  Widget _tabBarPageTwo() {
    return TabBarSecond();
  }

  Widget _tabBarPageThree() {
    return TabBarThird();
  }
}

