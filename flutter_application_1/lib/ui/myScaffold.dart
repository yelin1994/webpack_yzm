import 'package:flutter/material.dart';
class MyAppBar extends StatelessWidget {
  final Widget title;
  MyAppBar({this.title});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 56,
      padding: EdgeInsets.symmetric(horizontal: 8.0),  
      decoration: BoxDecoration(color: Colors.blue[500]),
      child: Row(
        children: [
          IconButton(icon: Icon(Icons.menu), onPressed: null, tooltip: 'navigation menu',),
          Expanded(child: title,),
          IconButton(icon: Icon(Icons.search), onPressed: null, tooltip: 'search',),
        ],
      ),
    );
  }
}

class MyScaffold extends StatelessWidget {
  
  Widget build(BuildContext context) {
    return Material(
      child: Column(
        children: [
          MyAppBar(
            title: Text(
              'Example title d',
              style: Theme.of(context)
                  .primaryTextTheme
                  .headline6,
              overflow: TextOverflow.ellipsis,
              maxLines: 1
            ),
          ),
          Expanded(child: Center(child: Text('hello world')),)
        ],
      ),
    );
  }
}
