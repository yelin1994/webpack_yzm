import 'package:flutter/material.dart';

class MyButton extends StatelessWidget {
  
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        print('mybutton');
      },
      child: Container(
        height: 50.0,
        padding: EdgeInsets.all(8.0),
        margin: EdgeInsets.symmetric(horizontal: 8.0),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(5.0),
          color: Colors.lightGreen[500],
        ),
        child: Center(child: Text('Engage'),),
      ),
    );
  }
}