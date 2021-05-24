
import 'package:flutter/material.dart';
import "dart:async";

class TabBarFirst extends StatefulWidget {
  @override
  _TabBarFirstState createState() => _TabBarFirstState();
}

class _TabBarFirstState extends State<TabBarFirst> with AutomaticKeepAliveClientMixin{
  final ScrollController scrollController = ScrollController();
  double offset = 0;
  bool isEnd = false;
  Control control = Control(false, []);
  @override
  void initState() {
    super.initState();
    scrollController.addListener(() {
      setState(() {
        offset = scrollController.offset;
        isEnd = scrollController.position.pixels == scrollController.position.maxScrollExtent;
      });
    });
  }


  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
        key: Key('121313'),
        child: ListView.builder(
          itemBuilder: (context, index) {
            return _getItemList(index);
          },
          itemCount: _getListCount(),
          controller: scrollController,
          physics: AlwaysScrollableScrollPhysics(),
        ),
        onRefresh: _doRefresh,
    );
  }

  Future<void> _doRefresh() async {
    await Future<Null>.delayed(Duration(seconds: 3), () {
      setState(() {
        this.control.dataList.addAll(List.generate(2, (index) {return index;}));
      });
    });
  }

 
 @override
  bool get wantKeepAlive => true;


  Widget _buildProgressIndicator() { // 上拉加载更多
    return Card(
      child: Column(
        children: [
          ListTile(
            title: Text('hello world'),
            subtitle: Text('welcome come to china'),
            leading:Icon(IconData(0xe69b, fontFamily: 'wxcIconFont'), size: 30,),
          ),
          Row(
            children: [
              TextButton(
                onPressed: onPressFun, 
                child: Text('hello'),
              ),
              SizedBox(width: 8),
              TextButton(onPressed: null, child: Text('list'))
            ],
            mainAxisAlignment: MainAxisAlignment.end,
          )
        ],
        mainAxisAlignment: MainAxisAlignment.start,
        mainAxisSize: MainAxisSize.max,
      ),
    );
  }

  onPressFun() {
    Navigator.pushNamed(context, 'layout demo test'); // 不带参数的路由表 跳转
    
    ///跳转新页面并且替换，比如登录页跳转主页
    // Navigator.pushReplacementNamed(context, routeName);

    ///跳转到新的路由，并且关闭给定路由的之前的所有页面
    // Navigator.pushNamedAndRemoveUntil(context, '/calendar', ModalRoute.withName('/'));

    ///带参数的路由跳转，并且监听返回
    // Navigator.push(context, new MaterialPageRoute(builder: (context) => NotifyPage())).then((res) {
          ///获取返回处理
    // });
  }

  Widget _buildEmpty() {
      return Center(
        child: Container(
          child: Text('empty hh')
        ),
      );
  }

  _getItemList(int index) {
    print(this.control.dataList);
    if (!control.needHeadler && index == control.dataList.length && control.dataList.length != 0) {
      ///如果不需要头部，并且数据不为0，当index等于数据长度时，渲染加载更多Item（因为index是从0开始）
      return _buildProgressIndicator();
    } else if (control.needHeadler && index == _getListCount() - 1 && control.dataList.length != 0) {
      ///如果需要头部，并且数据不为0，当index等于实际渲染长度 - 1时，渲染加载更多Item（因为index是从0开始）
      return _buildProgressIndicator();
    } else if (!control.needHeadler && control.dataList.length == 0) {
      ///如果不需要头部，并且数据为0，渲染空页面
      return _buildEmpty();
    } else {
      ///回调外部正常渲染Item，如果这里有需要，可以直接返回相对位置的index
      return _buildProgressIndicator();
    }
  }


  _getListCount() {
    if(control.needHeadler) {
      return (control.dataList.length > 0) 
        ? control.dataList.length + 2
        : control.dataList.length + 1;
    } else {
      if (control.dataList.length == 0) {
        return 1;
      }
      return (control.dataList.length > 0) 
      ? control.dataList.length + 1
      : control.dataList.length;
    } 
  }
}

class Control {
  bool needHeadler;
  List<Object> dataList;

  Control(this.needHeadler, this.dataList);
}