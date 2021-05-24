// import 'package:flutter/material.dart';
// import 'package:gsy_flutter_demo/api/countState.dart';
// import 'package:flutter_redux/flutter_redux.dart';

// class TabBarThird extends StatefulWidget {
//   @override
//   _TabBarThirdState createState() => _TabBarThirdState();
// }

// class _TabBarThirdState extends State<TabBarThird> with AutomaticKeepAliveClientMixin{
  
//   @override
//   void initState() {
//     super.initState();
//     print('3333');
//   }

//   @override
//   Widget build(BuildContext context) {
//     return WillPopScope(
//       child: StoreConnector<CounterState, int>(
//         builder: (context, count) { // scopedModelDescendantBuilder 
//           return Scaffold(
//             body: Center(
//               child: Text(
//                 count.toString(),
//                 style: TextStyle(fontSize: 48.0),
//               ),
//             ),
//             floatingActionButton: StoreConnector<CounterState, VoidCallback>(
//               builder: (context, callback) {
//                 return FloatingActionButton(child: Icon(Icons.add), onPressed: callback,);
//               }, 
//               converter: (store) {
//                 return () => store.dispatch(ActionState.Increment);
//               }
//             )
//           );
//         },
//         converter: (store) => store.state.count,
//       ), 
//       onWillPop: () {
//         return _dialogExitApp(context);
//       }
//     );
//   }

//   @override
//   bool get wantKeepAlive => true;

//   Future<bool> _dialogExitApp(BuildContext context) {
//     return showDialog(
//       context: context, 
//       builder: (context) => AlertDialog(
//         content: Text('是否退出'),
//         actions: [
//           TextButton(onPressed: () => Navigator.of(context).pop(false), child:  Text('取消'),),
//           TextButton(onPressed: () => Navigator.of(context).pop(true), child: Text('确定'))
//         ]
//       )
//     );
//   }
// }