
import 'package:flutter/material.dart';
// import 'ui/myApp.dart';
// import 'ui/myScaffold.dart';
// import 'package:flutter_application_1/ui/demo.dart';
// import 'package:flutter_application_1/ui/tutorialHome.dart';
// import 'package:flutter_application_1/ui/myButton.dart';
// import 'package:flutter_application_1/ui/counter.dart';
// import 'package:flutter_application_1/ui/shopping.dart';
import 'package:flutter_application_1/news.dart';
void main() {
  runApp(TabbedAppBarMain());
}

class TabbedAppBarMain extends StatelessWidget {
  var titleList = ['NEWS', 'LABS'];
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(
        primaryColor: Colors.white,
      ),
      home: DefaultTabController(
        child: Scaffold(
          appBar: AppBar(
            elevation: 0.0,
            title: TabBar(
              tabs: [
                Tab(text: titleList[0],),
                Tab(text: titleList[1])
              ],
              isScrollable: false,
              unselectedLabelColor: Colors.black26,
              labelColor: Colors.black,
              labelStyle: TextStyle(fontSize: 18.0),
              indicatorSize: TabBarIndicatorSize.label,
              indicatorWeight: 4.0,
              indicatorColor: Colors.yellow,
              indicatorPadding: EdgeInsets.only(bottom: 1.0),
            ),
          ),
          body: TabBarView(children: [
            News(url: 'http://app3.qdaily.com/app3/homes/index_v2/',),
            News(url: 'http://app3.qdaily.com/app3/papers/index/',)
            
          ],),
        ),
        length: titleList.length,
      ),
    );
  }
}



 

