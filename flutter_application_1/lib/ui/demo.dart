import 'package:flutter/material.dart';

class DemoWidget extends StatelessWidget {
  final String text;
  DemoWidget(this.text);
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      child: Text(text ?? 'something default')
    );
  }
}

