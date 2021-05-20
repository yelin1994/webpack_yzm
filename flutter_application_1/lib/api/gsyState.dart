import 'package:flutter/material.dart';
import 'package:redux/redux.dart';

class GSYState {
  User userInfo;
  ThemeData themeData;
  Locale locale;
  GSYState({this.userInfo, this.themeData, this.locale});
}

class User {

}

User userReducer(User user, action) {
  return user;
}

class ThemeData {

}

ThemeData themeDataReducer(ThemeData themeData, action) {
  return themeData;
}

class Locale {

}

Locale localeReducer(Locale locale, action) {
  return locale;
}