import 'package:scoped_model/scoped_model.dart';

class CountModel extends Model {
  int _count = 0;
  get count => _count;

  increment() {
    _count++;
    notifyListeners(); // 通知所有用到该model 的子项更新状态
  }
}