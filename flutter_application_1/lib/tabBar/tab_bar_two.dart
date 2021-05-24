
import 'package:flutter/material.dart';
// import 'package:scoped_model/scoped_model.dart';
// import 'package:gsy_flutter_demo/api/countModel.dart';

class TabBarSecond extends StatefulWidget {
  @override
  _TabBarSecondState createState() => _TabBarSecondState();
}

class _TabBarSecondState extends State<TabBarSecond>  with AutomaticKeepAliveClientMixin{
  @override
  void initState() {
    super.initState();
    print('2222');
  }
  final TextEditingController controller = TextEditingController();

  @override
  Widget build(BuildContext context) {

    // return ScopedModelDescendant<CountModel>(
    //   builder: (context, child, model) { // scopedModelDescendantBuilder 
    //     return Scaffold(
    //       body: Center(
    //         child: Text(
    //           model.count.toString(),
    //           style: TextStyle(fontSize: 48.0),
    //         ),
    //       ),
    //       floatingActionButton: FloatingActionButton(
    //         onPressed: () => model.increment(),
    //         tooltip: 'Increment',
    //         child: Icon(Icons.add),
    //       ),
    //     );
    //   },
    //   rebuildOnChange: true, // 属性变化时，是否rebuild 作用等同于setState
    // );
    return TextField(
      onChanged: onChange,
      decoration: InputDecoration(
        hintText: 'hhehe',
      ),
    );
  }

  void onChange(String str) {
    print(str);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    controller.value = TextEditingValue(text: '请输入参数');
  }
  @override
  bool get wantKeepAlive => true;
}