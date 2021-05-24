import 'package:flutter/material.dart';

class YZMTabBar extends StatefulWidget{
  static const BOTTOM_TAB = 'BOTTOM_TAB';
  final String type;
  final List<Widget> tabeItems;
  final List<Widget> tabViews;
  final PageController topPageControl;
  final Color backgroundColor;
  final Color indicator;
  final Text title;
  final Widget draw;
  YZMTabBar({this.type, this.tabeItems, this.tabViews, this.topPageControl, this.backgroundColor, this.indicator, this.title, this.draw});

  @override
  _YZMTabBarState createState() => _YZMTabBarState();
}

class _YZMTabBarState extends State<YZMTabBar> with  SingleTickerProviderStateMixin{
  TabController _tabControl;
  @override
  void initState() {
    super.initState();
    print('111');
    _tabControl = TabController(length: _tabItems().length, vsync: this);
  }

  @override
  void dispose() {
    _tabControl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: _draw() ?? null, // 侧边滑出
      floatingActionButton: _floatingActionButton(), // 悬浮按钮
      appBar: AppBar(
        actions: [],
        title: _title(),
        bottom: TabBar(
          isScrollable: true, // 顶部可以滑动
          controller: _tabControl,
          tabs: _tabItems(),
          labelColor: Colors.white,
          labelStyle: TextStyle(fontSize: 14),
          unselectedLabelColor: Colors.white,
          indicator: BoxDecoration(
            color: Colors.white,
            borderRadius:  BorderRadius.only(topLeft: Radius.circular(5), topRight: Radius.circular(5))
          ),
        ),
      ),
      body: PageView(
        children: _tabView() ,
        controller: _pageController(),
        onPageChanged: (index) {
          _tabControl.animateTo(index);
        },
      ),
      bottomNavigationBar: Material(
        color: Colors.grey,
        child: TabBar(
          controller: _tabControl,
          tabs: _tabItems(),
          indicator: BoxDecoration(color: Colors.white), // 选中条的颜色
        ),
      ),
    );
  }

  Widget _draw() {
    return widget.draw;
  }

  Widget _floatingActionButton() {
    return Container();
  }

  Widget _title() {
    return widget.title;
  }

  List<Widget> _tabView() {
    return widget.tabViews;
  }

  PageController _pageController() {
    return widget.topPageControl;
  }

  List<Widget> _tabItems() {
    return widget.tabeItems;
  }

  Color _indictor() {
    return widget.indicator;
  }
}





