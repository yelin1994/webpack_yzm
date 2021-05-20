import 'package:flutter/material.dart';

class Counter extends StatefulWidget {
  @override
  _CounterState createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int _counter = 0;
  void _increment() {
    setState(() {
      _counter++;
    });
  }

  Widget build(BuildContext context) {
    return Row(
      children: [
        ElevatedButton(onPressed: _increment, child: Text('increment')),
        SizedBox(width: 16),
        Text('Count: $_counter')
      ],
      mainAxisAlignment: MainAxisAlignment.center,
    );
  }
}