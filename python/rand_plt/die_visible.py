from die import Die
import plotly.express as px

die = Die() # 创建一个6面的骰子
results = [] # 存储掷骰子的结果
for roll_num in range(1000):
    result = die.roll()
    results.append(result)

# 分析结果
frequencies = [] # 存储每个点数出现的次数
poss_results = list(range(1, die.num_sides + 1))
for value in poss_results:
    frequency = results.count(value)
    frequencies.append(frequency)

# 可视化结果
labels ={ 'x': '点数', 'y': '出现次数' }
fix = px.bar(x= poss_results, y=frequencies, labels=labels, title='掷骰子1000次的结果分布')
fix.show()